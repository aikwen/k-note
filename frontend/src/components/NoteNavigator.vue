<template>
  <el-collapse v-model="activePanels" class="note-nav-collapse">
    <el-collapse-item name="notes">
      <!-- 折叠标题：左边小图标 + “导航” -->
      <template #title>
        <span class="collapse-icon">
          <el-icon v-if="!isNotesActive">
            <CirclePlusFilled />
          </el-icon>
          <el-icon v-else>
            <RemoveFilled />
          </el-icon>
        </span>
        <span class="breadcrumb-label">导航</span>
      </template>

      <!-- 折叠内容：上 = 分类；下 = 虚拟树 -->
      <div class="collapse-content">
        <!-- 上：分类列表（并列） -->
        <div class="category-list">
          <div
            v-for="cat in categories"
            :key="cat.name"
            class="category-item"
            :class="{ 'category-item--active': activeCategoryName === cat.name }"
            @click="handleCategoryClick(cat)"
          >
            <el-icon class="category-folder-icon">
              <component
                :is="
                  activeCategoryName === cat.name
                    ? FolderOpened
                    : Folder
                "
              />
            </el-icon>
            <span class="category-name">
              {{ cat.name }}
            </span>
          </div>
        </div>

        <!-- 下：虚拟树，展示当前分类下的多级目录 -->
        <div class="tree-wrapper">
          <template v-if="activeCategory">
            <el-tree-v2
              class="note-tree"
              :data="treeData"
              :props="treeProps"
              :height="240"
              :item-size="24"
              :current-node-key="currentNodeKey"
              expand-on-click-node
              @node-click="handleTreeNodeClick"
            />
          </template>
          <template v-else>
            <div class="tree-empty">请选择上方的分类</div>
          </template>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CirclePlusFilled,
  RemoveFilled,
  Folder,
  FolderOpened,
} from '@element-plus/icons-vue'
import type { NoteFile, NoteNode, Category } from '@/types/note'

const props = defineProps<{
  categories: Category[]
  selectedFile: NoteFile | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedFile', file: NoteFile | null): void
}>()

// 折叠面板
const activePanels = ref<string[]>([])
const isNotesActive = computed(() => activePanels.value.includes('notes'))

// 当前选中的分类名
const activeCategoryName = ref<string | null>(null)

// 当前分类对象
const activeCategory = computed<Category | null>(() => {
  if (!activeCategoryName.value) return null
  return props.categories.find(c => c.name === activeCategoryName.value) ?? null
})

// el-tree-v2 用的 props
const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children',
} as const

// 当前分类下的树数据：多级目录直接用 nodes
const treeData = computed<NoteNode[]>(() => {
  return activeCategory.value?.nodes ?? []
})

// 高亮当前选中的文件节点（id 对应 file.id）
const currentNodeKey = computed(() => props.selectedFile?.id ?? null)

// 点击上面的分类
function handleCategoryClick(cat: Category) {
  if (activeCategoryName.value === cat.name) {
    // 再点一次同一个分类 -> 取消选中
    activeCategoryName.value = null
    emit('update:selectedFile', null)
  } else {
    activeCategoryName.value = cat.name
    emit('update:selectedFile', null)
  }
}

// 树节点点击：只有文件节点才触发 selectedFile
function handleTreeNodeClick(nodeData: unknown) {
  const node = nodeData as NoteNode
  if (node.type === 'file' && node.fileRef) {
    emit('update:selectedFile', node.fileRef)
  }
}
</script>

<style scoped>
/* 折叠整体透明，无边框 */
.note-nav-collapse {
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
}

:deep(.el-collapse-item) {
  margin-bottom: 0;
}

/* 头部：高度很低，文字左侧留一点空隙，内容用 flex 垂直居中 */
:deep(.el-collapse-item__header) {
  background: transparent;
  border-bottom: none;
  padding: 2px 0;
  padding-left: 8px;
  height: auto;
  min-height: 0;
  line-height: 1.2;
  font-size: 13px;

  display: flex;
  align-items: center;
}

/* 隐藏默认的 > 箭头 */
:deep(.el-collapse-item__arrow) {
  display: none;
}

/* 左侧小图标（+ / -），和文字对齐 */
.collapse-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
}

.collapse-icon .el-icon {
  font-size: 10px;
  line-height: 1;
  color: #555;
}

:deep(.el-collapse-item__wrap) {
  background: transparent;
  border-bottom: none;
}

.breadcrumb-label {
  font-size: 13px;
  color: #555;
}

/* 折叠内容整体区域：上下两块 */
.collapse-content {
  font-size: 13px;
  color: #555;
  padding: 2px 0 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* === 上：分类列表（并列） === */
.category-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
  row-gap: 4px;
  padding-left: 8px; /* 和上方“导航”左边对齐 */
}

.category-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.category-item--active .category-name {
  font-weight: 600;
}

.category-folder-icon {
  font-size: 12px;
  margin-right: 4px;
  color: #555;
}

.category-name {
  font-size: 13px;
}

/* === 下：虚拟树区域 === */
.tree-wrapper {
  padding-left: 8px;
  padding-top: 2px;
}

.tree-empty {
  font-size: 13px;
  color: #777;
}

/* el-tree-v2 本身的样式：背景透明，跟外面一致 */
.note-tree {
  font-size: 13px;
  background-color: transparent;
}

/* 防止某些主题给 tree 节点加白底 */
:deep(.el-tree-node__content) {
  background-color: transparent;
}
</style>
