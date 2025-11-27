// src/composables/useCategories.ts
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Category } from '@/types/note'

const DEFAULT_API_BASE = 'http://localhost:9999'
const DEFAULT_API_ENDPOINT = '/api/v1/categories'

interface CategoriesResponse {
  toc: Category[]
}

export function useCategories(
                apiBase: string = DEFAULT_API_BASE,
                apiEndpoint: string = DEFAULT_API_ENDPOINT) {
  const categories = ref<Category[]>([])
  const categoriesLoading = ref(false)
  const categoriesError = ref<string | null>(null)

  const fetchCategories = async () => {
    categoriesLoading.value = true
    categoriesError.value = null
    try {
      const resp = await axios.get<CategoriesResponse>(`${apiBase}${apiEndpoint}`)
      categories.value = resp.data.toc
    } catch (err) {
      console.error('加载分类失败：', err)
      categoriesError.value = '分类加载失败'
    } finally {
      categoriesLoading.value = false
    }
  }

  // 进入页面自动拉一次
  onMounted(fetchCategories)

  return {
    categories,
    categoriesLoading,
    categoriesError,
    fetchCategories,
  }
}
