package file

import (
	"os"
	"io"
	"strings"
)


func ReadFile(path string) ([]byte, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer file.Close()
	// 读取所有数据
    data, err := io.ReadAll(file)
    if err != nil {
        return nil, err
    }
    return data, nil
}


// 判断是否是 markdown 文件
func isMarkdownFile(name string) bool {
	lower := strings.ToLower(name)
	return strings.HasSuffix(lower, ".md") || strings.HasSuffix(lower, ".markdown")
}

// 展示名：去掉 .md / .markdown
func trimMdSuffix(name string) string {
	lower := strings.ToLower(name)
	if strings.HasSuffix(lower, ".markdown") {
		return name[:len(name)-len(".markdown")]
	}
	if strings.HasSuffix(lower, ".md") {
		return name[:len(name)-len(".md")]
	}
	return name
}