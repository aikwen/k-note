package file

import (
	"fmt"
	"os"
	"path/filepath"

	"k-note/internal/auth"
	"k-note/internal/hash"
)

// ---- 目录结构 ----

// 文件（内层 id，用来 /api/file?id=...）
type NoteFile struct {
	ID   string `json:"id"`   // 稳定的文件 id（基于内容 hash）
	Name string `json:"name"` // "channel.md"
	Path string `json:"-"`    // 相对路径（内部用，不返回给前端）
}

// 目录树节点（外层 id，用 nanoid）
type NoteNode struct {
	ID       string      `json:"id"`                 // 节点 id（go-nanoid 生成）
	Name     string      `json:"name"`               // 展示名
	Type     string      `json:"type"`               // "folder" or "file"
	Children []*NoteNode `json:"children,omitempty"` // 子节点（仅 folder）
	FileRef  *NoteFile   `json:"fileRef,omitempty"`  // 文件节点才有
}

type Category struct {
    Name  string           `json:"name"`
    Nodes []*NoteNode      `json:"nodes"`
}

// ---- 对外入口：构建根目录 A 的树 ----
// BuildCategories 是对外更高层的入口
func BuildCategoriesAndIndex(rootDir string) ([]*Category, map[string]*NoteFile, error) {
    roots, err := BuildNoteTree(rootDir)
    if err != nil {
        return nil, nil, err
    }

    cats := make([]*Category, 0, len(roots))
    index := make(map[string]*NoteFile)

    for _, node := range roots {
        if node == nil {
            continue
        }
        if node.Type != "folder" {
            continue
        }

        cats = append(cats, &Category{
            Name:  node.Name,
            Nodes: node.Children,
        })

        // 递归收集这个分类下面的所有 fileRef
        collectFileIndex(node.Children, index)
    }

    return cats, index, nil
}

// 递归遍历 NoteNode 树，把所有文件节点的 FileRef 收集到索引里
func collectFileIndex(nodes []*NoteNode, index map[string]*NoteFile) {
    for _, n := range nodes {
        if n == nil {
            continue
        }
        if n.Type == "file" && n.FileRef != nil {
            index[n.FileRef.ID] = n.FileRef
        }
        if len(n.Children) > 0 {
            collectFileIndex(n.Children, index)
        }
    }
}


// rootDir = A 目录的绝对路径
// 规则：
//   - 忽略 .git
//   - 忽略根目录下的普通文件
//   - 只有“不为空 && （自身或子孙目录）中存在 .md 文件”的目录才返回
func BuildNoteTree(rootDir string) ([]*NoteNode, error) {
	entries, err := os.ReadDir(rootDir)
	if err != nil {
		return nil, fmt.Errorf("read root dir: %w", err)
	}

	var result []*NoteNode

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		if entry.Name() == ".git" {
			continue
		}

		absPath := filepath.Join(rootDir, entry.Name())
		relPath := entry.Name() // 相对 rootDir 的路径（第一层文件夹名）

		node, hasMarkdown, err := buildDirNode(absPath, relPath)
		if err != nil {
			return nil, err
		}
		if hasMarkdown {
			result = append(result, node)
		}
	}

	return result, nil
}

// 递归构建目录节点：
// dirAbs  = 当前目录绝对路径
// relPath = 相对 rootDir 的路径，比如 "golang/concurrency"
func buildDirNode(dirAbs, relPath string) (*NoteNode, bool, error) {
	entries, err := os.ReadDir(dirAbs)
	if err != nil {
		return nil, false, fmt.Errorf("read dir %s: %w", dirAbs, err)
	}

	var children []*NoteNode
	hasMarkdown := false

	for _, entry := range entries {
		name := entry.Name()

		// ---- 子目录 ----
		if entry.IsDir() {
			if name == ".git" {
				continue
			}
			childAbs := filepath.Join(dirAbs, name)
			childRel := filepath.Join(relPath, name)

			childNode, childHasMd, err := buildDirNode(childAbs, childRel)
			if err != nil {
				return nil, false, err
			}
			if childHasMd {
				children = append(children, childNode)
				hasMarkdown = true
			}
			continue
		}

		// ---- 普通文件：只关心 markdown ----
		if !isMarkdownFile(name) {
			continue
		}

		hasMarkdown = true

		// 相对 rootDir 的路径
		fileRel := filepath.Join(relPath, name)
		// 当前文件的绝对路径，用来算内容哈希
		fileAbs := filepath.Join(dirAbs, name)

		// ✅ 用你自己的函数算内容哈希
		hashVal, err := hash.HashFile(fileAbs)
		if err != nil {
			return nil, false, fmt.Errorf("hash file %s: %w", fileAbs, err)
		}
		fileID := fmt.Sprintf("%x", hashVal) // 转成 hex 字符串当 id，用起来更方便

		file := &NoteFile{
			ID:   fileID,
			Name: name,
			Path: fileRel,
		}

		fileNode := &NoteNode{
			ID:      auth.NewNodeID(),    // 节点 id：nanoid
			Name:    trimMdSuffix(name), // 展示名：去掉 .md
			Type:    "file",
			FileRef: file,
		}
		children = append(children, fileNode)
	}

	if !hasMarkdown {
		// 自己和子目录都没有 markdown，整体丢弃
		return nil, false, nil
	}

	dirNode := &NoteNode{
		ID:       auth.NewNodeID(),         // 目录节点也用 nanoid
		Name:     filepath.Base(relPath),  // 目录名
		Type:     "folder",
		Children: children,
	}

	return dirNode, true, nil
}