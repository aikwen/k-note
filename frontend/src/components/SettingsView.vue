<template>
  <div class="settings-root">
    <h2 class="settings-title">设置</h2>

    <!-- 显示当前身份 -->
    <div class="settings-identity">
      当前身份：
      <span
        class="settings-identity-tag"
        :class="isAdmin ? 'tag-admin' : 'tag-guest'"
      >
        {{ isAdmin ? '管理员' : '游客' }}
      </span>
    </div>

    <!-- 通用：修改密码（游客、管理员都有） -->
    <section class="settings-card">
      <h3 class="settings-section-title">修改密码</h3>

      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-position="top"
        class="settings-form"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            autocomplete="off"
          />
        </el-form-item>

        <div class="settings-actions">
          <el-button
            class="settings-btn"
            type="default"
            @click="onSubmitPassword"
          >
            保存密码
          </el-button>
        </div>
      </el-form>
    </section>

    <!-- 仅管理员可见：GitHub、Deploy Keys 等 -->
    <section v-if="isAdmin" class="settings-card">
      <h3 class="settings-section-title">仓库与 Deploy Keys</h3>

      <el-form
        ref="adminFormRef"
        :model="adminForm"
        :rules="adminRules"
        label-position="top"
        class="settings-form"
      >
        <el-form-item
          label="GitHub 仓库地址"
          prop="githubRepo"
        >
          <el-input
            v-model="adminForm.githubRepo"
            placeholder="例如：https://github.com/xxx/your-note-repo"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="Deploy Key（只读访问 GitHub 仓库）"
          prop="deployKey"
        >
          <el-input
            v-model="adminForm.deployKey"
            type="textarea"
            :rows="4"
            placeholder="将 GitHub 仓库的只读 Deploy Key 粘贴在这里"
          />
        </el-form-item>

        <div class="settings-actions">
          <el-button
            class="settings-btn"
            type="default"
            @click="onSubmitAdmin"
          >
            保存仓库配置
          </el-button>
        </div>
      </el-form>
    </section>

    <!-- 仅管理员可见：同步状态 -->
    <section v-if="isAdmin" class="settings-card">
      <div class="settings-card-header">
        <h3 class="settings-section-title">同步状态</h3>
        <!-- 这里是“查询同步状态”的按钮 -->
        <el-button
          class="settings-icon-btn"
          :icon="Refresh"
          text
          circle
          @click="onRefreshStatus"
          :loading="isCheckingStatus"
        />
      </div>

      <div class="sync-body">
        <div class="sync-row">
          <span class="sync-label">上次同步时间：</span>
          <span class="sync-value">
            {{ lastSyncTime || '尚未同步' }}
          </span>
        </div>

        <div class="settings-actions">
          <!-- 这里是“发起同步”的按钮 -->
          <el-button
            class="settings-btn"
            type="default"
            :loading="isSyncing"
            @click="onSyncNow"
          >
            立刻同步
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { useAuth } from '@/stores/auth'
import {
  usePasswordSettings,
  useAdminSettings,
  useSyncSettings,
} from '@/composables/setting'

const { identity } = useAuth()

// 当前是否管理员
const isAdmin = computed(() => identity.value === 'admin')

// 1. 修改密码表单
const {
  passwordFormRef,
  passwordForm,
  passwordRules,
  onSubmitPassword,
} = usePasswordSettings()

// 2. 管理员 GitHub / Deploy Key 表单
const {
  adminFormRef,
  adminForm,
  adminRules,
  onSubmitAdmin,
} = useAdminSettings()

// 3. 同步状态
const {
  lastSyncTime,
  isSyncing,
  isCheckingStatus,
  onSyncNow,
  onRefreshStatus,
} = useSyncSettings()
</script>

<style scoped>
.settings-root {
  max-width: 640px;
  margin: 40px auto;
}

/* 标题 */
.settings-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
}

/* 当前身份一行 */
.settings-identity {
  margin-bottom: 16px;
  font-size: 14px;
  color: #4b5563;
}

.settings-identity-tag {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

/* 不同身份的色块 */
.tag-guest {
  background-color: #e5e7eb;
  color: #374151;
}

.tag-admin {
  background-color: #dbeafe;
  color: #1d4ed8;
}

/* 卡片区域（跟登录同一套扁平风格） */
.settings-card {
  margin-bottom: 20px;
  padding: 16px 18px 18px;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
}

/* 小标题 */
.settings-section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}

/* 内部表单 */
.settings-form {
  margin-top: 4px;
}

/* 底部按钮行 */
.settings-actions {
  margin-top: 12px;
  text-align: right;
}

/* 扁平风按钮（和登录按钮保持一套） */
.settings-btn {
  border-radius: 999px;
  border: 1px solid #d4d4d8;
  background-color: #f4f4f5;
  color: #111827;
  padding: 6px 16px;
  font-weight: 500;
}

.settings-btn:hover {
  border-color: #a1a1aa;
  background-color: #e4e4e7;
  color: #111827;
}

.settings-btn:active {
  background-color: #d4d4d8;
}

/* ========= 同步状态卡片 ========= */

.settings-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 右上角刷新按钮样式 */
.settings-icon-btn {
  border-radius: 999px;
  border-color: transparent;
  color: #6b7280;
  padding: 4px;
}

.settings-icon-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/* 同步状态正文 */
.sync-body {
  margin-top: 8px;
}

.sync-row {
  font-size: 14px;
  margin-bottom: 8px;
}

.sync-label {
  color: #4b5563;
}

.sync-value {
  color: #111827;
}
</style>
