<template>
  <div class="preview-root">
    <!-- 上：折叠面板（导航 + 虚拟树） -->
    <section class="preview-top">
      <NoteNavigator
        :categories="categories"
        v-model:selectedFile="selectedFile"
      />
    </section>

    <!-- 下：左右布局的预览区域 -->
    <section class="preview-bottom">
      <div class="preview-bottom-layout">
        <!-- 左：目录区域（占位） -->
        <aside ref="tocContainer" class="preview-toc">
          <div class="toc-title">目录</div>
            <div v-if="tocItems.length" class="toc-list">
              <ul>
                <li
                  v-for="(item, index) in tocItems"
                  :key="item.id + '-' + index"
                  class="toc-item"
                  :class="`toc-level-${item.level}`"
                  @click="scrollToHeading(item.id)"
                  v-html="item.html"
                />

              </ul>
            </div>
            <div v-else class="toc-placeholder">暂无目录</div>
        </aside>

        <!-- 右：预览页面区域 -->
        <section class="preview-main">
          <div class="page-wrapper">
            <!-- 右上角文件名小突起 -->
            <div class="page-tab">
              {{ selectedFile ? selectedFile.name : '首页' }}
            </div>

            <div class="page-inner">
              <div
                v-if="htmlContent"
                class="html-preview"
                v-html="htmlContent"
              ></div>
              <p v-else>
                内容为空....
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

import NoteNavigator from '@/components/NoteNavigator.vue'
import type { NoteFile } from '@/types/note'

import { useCategories } from '@/composables/useCategories'
import { useFilePreview } from '@/composables/useFilePreview'

import { renderMathIn } from '@/utils/math'
import { renderMermaidIn } from '@/utils/mermaid'
import { setupCodeCopyButtons } from '@/utils/codeCopy'

// 1. 目录：请求 /api/categories
const { categories } = useCategories()

// 2. 当前选中文件（和 NoteNavigator 用 v-model:selectedFile 联动）
const selectedFile = ref<NoteFile | null>(null)

// 3. 预览内容：根据 selectedFile 请求 /api/file，生成 html + toc
const { htmlContent, tocItems } = useFilePreview(selectedFile)

// 4. htmlContent 每次变化后：更新 DOM，再跑 KaTeX / Mermaid / 复制按钮
watch(htmlContent, async () => {
  await nextTick()

  // 正文区域数学
  renderMathIn('.html-preview')
  // TOC 区域数学
  // renderMathIn('.toc-list')

  // Mermaid 图
  renderMermaidIn('.html-preview')

  // 代码块复制按钮
  setupCodeCopyButtons('.html-preview')
})

// 5. 目录点击滚动
function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>


<style scoped>
/* 整体：最小高度填满屏幕（扣掉头部一点大致空间） */
.preview-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 120px);

}

/* 上部分：折叠面板区域，只有上下边框 */
.preview-top {
  border-top: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
  padding: 0;
}

/* 下部分：左右布局的预览区域 */
.preview-bottom {
  flex: 1;
  display: flex;
}

.preview-bottom-layout {
  display: flex;
  flex: 1;
  gap: 16px;
  align-items: stretch;
}

/* 左：目录区域（1 份宽度） */
.preview-toc {
  flex: 1;
  padding-right: 8px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
}

.toc-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.toc-placeholder {
  flex: 1;
  color: #777;
}

/* 右：预览页面区域（4 份宽度） */
.preview-main {
  flex: 4;
  display: flex;
  justify-content: center;
  padding-left: 8px;
}

/* 悬浮的页面卡片，最少填满右侧区域高度 */
.page-wrapper {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin-top: 12px;
  border: 1px solid #d4d4d8;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
  min-height: 100%;
}

/* 右上角文件名小突起 */
.page-tab {
  position: absolute;
  top: 0;
  right: 24px;
  transform: translateY(-50%);
  padding: 2px 10px;
  font-size: 12px;
  background: #e4e4e7;
  border: 1px solid #d4d4d8;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

/* 页面内部占位 */
.page-inner {
  padding: 16px 20px 20px;
  font-size: 14px;
  line-height: 1.7;
}
</style>
