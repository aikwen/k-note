// src/utils/nav.ts
import type { Category, NoteFile, NoteNode } from '@/types/note'

/**
 * 生成 15 个分类、不同层级结构的测试数据
 * 1-3: 只有文件
 * 4-7: 根上文件 + 单层文件夹
 * 8-12: 根上文件 + 两层文件夹
 * 13-15: 根上文件 + 三层文件夹
 */
export function generateMultiLevelCategories(): Category[] {
  // 辅助：创建一个文件节点 + 对应的 NoteFile
  const createFileNode = (
    catIndex: number,
    path: string,
    fileIndex: number
  ): { file: NoteFile; node: NoteNode } => {
    const id = `c${catIndex}-${path}-f${fileIndex}`
    const name = `file_${catIndex}_${path}_${fileIndex}.md`
    const file: NoteFile = { id, name }
    const node: NoteNode = {
      id,
      name,
      type: 'file',
      fileRef: file,
    }
    return { file, node }
  }

  // 递归创建一个文件夹节点（里面有文件 + 子文件夹）
  const createFolderNode = (
    catIndex: number,
    depth: number,
    maxDepth: number,
    path: string
  ): NoteNode => {
    const folderId = `c${catIndex}-${path}`
    const folderName = `folder_${catIndex}_${path}`
    const folder: NoteNode = {
      id: folderId,
      name: folderName,
      type: 'folder',
      children: [],
    }

    // 当前文件夹下放一些文件
    for (let f = 1; f <= 3; f++) {
      const { node } = createFileNode(catIndex, `${path}`, f)
      folder.children!.push(node)
    }

    // 如果还没到最大深度，则再放一些子文件夹
    if (depth < maxDepth) {
      for (let k = 1; k <= 2; k++) {
        const childPath = `${path}-${k}`
        const childFolder = createFolderNode(
          catIndex,
          depth + 1,
          maxDepth,
          childPath
        )
        folder.children!.push(childFolder)
      }
    }

    return folder
  }

  const result: Category[] = []

  for (let c = 1; c <= 15; c++) {
    const catName = `category-${c}`
    const nodes: NoteNode[] = []

    // 1–3：只有文件，没有文件夹
    if (c >= 1 && c <= 3) {
      for (let f = 1; f <= 10; f++) {
        const { node } = createFileNode(c, 'root', f)
        nodes.push(node)
      }
    }
    // 4–7：根上既有文件，又有一个文件夹（文件夹里只有文件）
    else if (c >= 4 && c <= 7) {
      // 根上的文件
      for (let f = 1; f <= 5; f++) {
        const { node } = createFileNode(c, 'root', f)
        nodes.push(node)
      }

      // 一个只有文件的文件夹
      const folderId = `c${c}-root-folder`
      const folderName = `folder_${c}_root`
      const folder: NoteNode = {
        id: folderId,
        name: folderName,
        type: 'folder',
        children: [],
      }
      for (let f = 1; f <= 5; f++) {
        const { node } = createFileNode(c, 'root-folder', f)
        folder.children!.push(node)
      }
      nodes.push(folder)
    }
    // 8–12：根上既有文件，又有文件夹，文件夹下有文件夹和文件（两层文件夹）
    else if (c >= 8 && c <= 12) {
      // 根上的文件
      for (let f = 1; f <= 5; f++) {
        const { node } = createFileNode(c, 'root', f)
        nodes.push(node)
      }

      // 两个文件夹，每个文件夹内既有文件又有子文件夹（maxDepth = 2）
      for (let idx = 1; idx <= 2; idx++) {
        const rootFolder = createFolderNode(c, 1, 2, `lvl1-${idx}`)
        nodes.push(rootFolder)
      }
    }
    // 13–15：根上既有文件，又有文件夹；子文件夹继续嵌套（3 层文件夹）
    else if (c >= 13 && c <= 15) {
      // 根上的文件
      for (let f = 1; f <= 5; f++) {
        const { node } = createFileNode(c, 'root', f)
        nodes.push(node)
      }

      // 两个多层文件夹（maxDepth = 3）
      for (let idx = 1; idx <= 2; idx++) {
        const rootFolder = createFolderNode(c, 1, 3, `lvl1-${idx}`)
        nodes.push(rootFolder)
      }
    }

    result.push({
      name: catName,
      nodes,
    })
  }

  return result
}
