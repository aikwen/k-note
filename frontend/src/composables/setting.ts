// src/composables/setting.ts
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

/**
 * 1. 修改密码表单（游客 & 管理员通用）
 */
export interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export function usePasswordSettings() {
  const passwordFormRef = ref<FormInstance>()
  const passwordForm = ref<PasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const passwordRules: FormRules<PasswordForm> = {
    oldPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' },
    ],
    newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (_, value, callback) => {
          if (value !== passwordForm.value.newPassword) {
            callback(new Error('两次输入的新密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
  }

  const onSubmitPassword = () => {
    if (!passwordFormRef.value) return

    passwordFormRef.value.validate((valid) => {
      if (!valid) return

      // TODO: 在这里调用后端 API，提交修改密码请求
      ElMessage({
        message: '密码已保存（这里暂时是前端假逻辑）',
        customClass: 'k-note-message',
      })
    })
  }

  return {
    passwordFormRef,
    passwordForm,
    passwordRules,
    onSubmitPassword,
  }
}

/**
 * 2. 管理员专用配置（GitHub 仓库 & Deploy Key）
 */
export interface AdminForm {
  githubRepo: string
  deployKey: string
}

export function useAdminSettings() {
  const adminFormRef = ref<FormInstance>()
  const adminForm = ref<AdminForm>({
    githubRepo: '',
    deployKey: '',
  })

  const adminRules: FormRules<AdminForm> = {
    githubRepo: [
      { required: true, message: '请输入 GitHub 仓库地址', trigger: 'blur' },
    ],
    // deployKey 可以按需求设为必填 / 非必填
  }

  const onSubmitAdmin = () => {
    if (!adminFormRef.value) return

    adminFormRef.value.validate((valid) => {
      if (!valid) return

      // TODO: 调用后端 API 保存 githubRepo / deployKey
      ElMessage({
        message: '仓库配置已保存（这里暂时是前端假逻辑）',
        customClass: 'k-note-message',
      })
    })
  }

  return {
    adminFormRef,
    adminForm,
    adminRules,
    onSubmitAdmin,
  }
}

/**
 * 3. 同步状态（仅管理员）
 * - 查询同步状态：checkSyncStatus（顶部刷新按钮）
 * - 发起同步：startSync（底部「立刻同步」按钮）
 */
export function useSyncSettings() {
  const lastSyncTime = ref<string>('')    // 显示的时间
  const isSyncing = ref(false)           // 发起同步中的 loading
  const isCheckingStatus = ref(false)    // 查询状态中的 loading

  function formatNow(): string {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
  }

  // 查询同步状态：将来这里对应 GET /api/sync/status
  const checkSyncStatus = async () => {
    if (isCheckingStatus.value) return
    isCheckingStatus.value = true
    try {
      // TODO: 改成真实的状态查询请求
      await new Promise((resolve) => setTimeout(resolve, 500))

      // demo：这里可以根据后端返回设置 lastSyncTime
      // 例如：lastSyncTime.value = resp.lastSyncTime
      ElMessage({
        message: '已刷新同步状态（当前为模拟逻辑）',
        customClass: 'k-note-message',
      })
    } catch {
      ElMessage({
        message: '查询同步状态失败，请稍后重试',
        type: 'error',
        customClass: 'k-note-message',
      })
    } finally {
      isCheckingStatus.value = false
    }
  }

  // 发起同步：将来这里对应 POST /api/sync
  const startSync = async () => {
    if (isSyncing.value) return
    isSyncing.value = true
    try {
      // TODO: 这里改成真实的同步请求
      await new Promise((resolve) => setTimeout(resolve, 800))

      lastSyncTime.value = formatNow()
      ElMessage({
        message: '同步完成（当前为模拟逻辑）',
        customClass: 'k-note-message',
      })
    } catch {
      ElMessage({
        message: '同步失败，请稍后重试',
        type: 'error',
        customClass: 'k-note-message',
      })
    } finally {
      isSyncing.value = false
    }
  }

  const onRefreshStatus = () => {
    void checkSyncStatus()
  }

  const onSyncNow = () => {
    void startSync()
  }

  return {
    lastSyncTime,
    isSyncing,
    isCheckingStatus,
    onRefreshStatus,
    onSyncNow,
  }
}
