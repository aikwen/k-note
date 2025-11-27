// src/stores/auth.ts
import { ref } from 'vue'

// 身份类型：游客 / 管理员
export type Identity = 'guest' | 'admin'

// 登录状态
const isLoggedIn = ref(localStorage.getItem('k_note_logged_in') === '1')
const username = ref(localStorage.getItem('k_note_username') || '')

// 身份：从本地恢复，没有就默认为 guest
const storedIdentity = localStorage.getItem('k_note_identity') as Identity | null
const identity = ref<Identity>(storedIdentity || 'guest')
export { identity }

export function useAuth() {
  /**
   * 登录：增加一个 identity 参数
   *  - name: 用户名
   *  - id: 身份（'guest' | 'admin'），默认 guest
   */
  const login = (name: string, id: Identity = 'guest') => {
    isLoggedIn.value = true
    username.value = name
    identity.value = id

    localStorage.setItem('k_note_logged_in', '1')
    localStorage.setItem('k_note_username', name)
    localStorage.setItem('k_note_identity', id)
  }

  const logout = () => {
    isLoggedIn.value = false
    username.value = ''
    identity.value = 'guest'

    localStorage.removeItem('k_note_logged_in')
    localStorage.removeItem('k_note_username')
    localStorage.removeItem('k_note_identity')
  }

  return {
    isLoggedIn,
    username,
    identity, // ⭐ 这里一起返回，方便组件里直接拿
    login,
    logout,
  }
}
