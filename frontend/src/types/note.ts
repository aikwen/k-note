/** 单个笔记文件（对应一个 markdown/html） */
export interface NoteFile {
  id: string
  name: string
}

/** 多级目录节点：可以是文件夹或文件 */
export interface NoteNode {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: NoteNode[]
  fileRef?: NoteFile        // 仅 type === 'file' 时有效
}

/** 顶层分类：每个分类下面是一棵多级目录树 */
export interface Category {
  name: string
  nodes: NoteNode[]
}

