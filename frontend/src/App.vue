<template>
  <div class="app-root">
    <el-container class="app-container">
      <!-- 头部 -->
      <el-header class="app-header" height="108px">
        <!-- 左侧：Logo + 文字 -->
        <div class="header-left" @click="handleLogoClick">
          <img
            class="logo"
            src="./assets/img/blob.svg"
            alt="k-note logo"
          />
          <span class="site-name">k-note</span>
        </div>

        <!-- 右侧：登录 / 用户菜单 -->
        <div class="header-right">
          <!-- 未登录：登录按钮 -->
          <el-button
            v-if="!isLoggedIn"
            link
            class="login-link"
            @click="handleLogin"
          >
            <el-icon class="login-icon">
              <User />
            </el-icon>
            <span>登录</span>
          </el-button>

          <!-- 已登录：用户名 + 下拉菜单 -->
          <el-dropdown
            v-else
            trigger="hover"
            @command="handleUserCommand"
          >
            <span class="user-trigger">
              {{ username  || '用户' }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  设置
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主体 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">

import { User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const { isLoggedIn, username, logout } = useAuth()

const handleLogoClick = () => {
  router.push('/')
}

const handleLogin = () => {
  router.push('/login')
}

const handleUserCommand = (command: string) => {
  if (command === 'settings') {
    router.push('/settings')
    console.log('go to settings')
  } else if (command === 'logout') {
    logout()
    router.push('/')
    console.log('logout')
    // 之后在这里清理 token / 调用退出接口，再 isLoggedIn.value = false
  }
}
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  background: rgb(251, 250, 249);
}

.app-container {
  width: 55%;
  min-height: 100vh;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1440px) {
  .app-container {
    width: 80%;
  }
}

/* 头部整体 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中 */
  padding: 0 16px;
  background: rgb(251, 250, 249);
}

/* 左侧：logo + 文本，垂直居中 + 可点击小手 */
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer; /* 鼠标放上去是小手 */
}

.logo {
  width: 60px;
  height: 60px;
}

/* “k-note” 垂直居中显示 */
.site-name {
  font-size: 33px;
  font-style: italic;
  line-height: 1;
}

/* 右侧：登录按钮 / 用户下拉 */
.header-right {
  display: flex;
  align-items: center;
}

/* 登录按钮：保留 link 风格，但默认用灰色文字 */
.login-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;      /* 更像文字链接 */
  margin: 0;
  font-size: 14px;
  color: #555;      /* 默认灰色文字 */
}

/* hover 时文字稍微变深一点 */
.login-link:hover {
  color: #111;
}

/* icon 始终保持灰色，不再 hover 变蓝 */
.login-icon {
  font-size: 18px;
  color: #909399;   /* 灰色 */
  transition: color 0.2s ease;
}

/* 用户名：默认灰色，hover 变深一点 */
.user-trigger {
  cursor: pointer;
  color: #555;
  font-size: 14px;
  outline: none;
}

.user-trigger:hover {
  color: #111;
}

.user-trigger:focus,
.user-trigger:focus-visible {
  outline: none;
}

/* 主体 */
.app-main {
  padding: 16px;
  background: rgb(251, 250, 249);
}
</style>
