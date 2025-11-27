// src/composables/useFilePreview.ts
import { ref, watch, type Ref } from 'vue'
import axios from 'axios'
import type { NoteFile } from '@/types/note'
import { buildTocFromHtml, type TocItem } from '@/utils/toc'

const DEFAULT_API_BASE = 'http://localhost:9999'
const DEFAULT_API_ENDPOINT = '/api/v1/file/'

interface FileDetailResponse {
  id: string
  name: string
  html: string
}

/**
 * 根据选中的文件，自动请求 /api/file?id=...，
 * 并生成 htmlContent + tocItems
 */
export function useFilePreview(
  selectedFile: Ref<NoteFile | null>,
  apiBase: string = DEFAULT_API_BASE,
  apiEndpoint: string = DEFAULT_API_ENDPOINT
) {
  const htmlContent = ref('')
  const tocItems = ref<TocItem[]>([])
  const htmlLoading = ref(false)
  const htmlError = ref<string | null>(null)

  watch(selectedFile, async (file) => {
    if (!file) {
      htmlContent.value = ''
      tocItems.value = []
      htmlError.value = null
      return
    }

    htmlLoading.value = true
    htmlError.value = null

    try {
      const resp = await axios.get<FileDetailResponse>(`${apiBase}${apiEndpoint}${file.id}`)

      const rawHtml = resp.data.html

      // 用你原来的工具生成带 id 的 html + 目录
      const { htmlWithIds, toc } = buildTocFromHtml(rawHtml)
      htmlContent.value = htmlWithIds
      tocItems.value = toc
    } catch (err) {
      console.error('加载文件内容失败：', err)
      htmlError.value = '内容加载失败'
      htmlContent.value = ''
      tocItems.value = []
    } finally {
      htmlLoading.value = false
    }
  })

  return {
    htmlContent,
    tocItems,
    htmlLoading,
    htmlError,
  }
}
