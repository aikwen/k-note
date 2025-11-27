\<template>
  <div class="login-root">
    <h2 class="login-title">登录</h2>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="login-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="请输入密码"
          autocomplete="off"
          @keyup.enter="onSubmit"
        />
      </el-form-item>

      <div class="login-actions">
        <el-button
        class="login-btn"
        type="default"
        @click="onSubmit">
          登录
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuth } from '@/stores/auth'

interface LoginForm {
  username: string
  password: string
}

const {login} = useAuth()
const router = useRouter()
const formRef = ref<FormInstance>()
const form = ref<LoginForm>({
  username: '',
  password: '',
})

const rules: FormRules<LoginForm> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const onSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (!valid) return

    const { username : u, password: p } = form.value

    // 假登录逻辑：用户名和密码都为 123 才算成功
    if (u === '123' || u ==="admin" && p === '123') {
      if (u === "admin") {
        login(u, "admin")
      }else{
        login(u, "guest")
      }

      ElMessage({
        message: '登录成功（当前为假登录逻辑）',
        customClass: 'k-note-message',
      })
      // 跳转到首页
      router.push('/')
    } else {
      ElMessage({
        message: '用户名或密码错误',
        customClass: 'k-note-message',
      })
    }
  })
}
</script>


<style scoped>
/* 整个登录区域：居中，不改背景色 */
.login-root {
  max-width: 360px;
  margin: 40px auto;
}

/* 标题，简单一点 */
.login-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: left;
}

/* 表单本身：扁平、不加背景/阴影 */
.login-form {
  /* 可以根据喜好给一个很浅的边框，也可以删掉这行 */
  border-top: 1px solid #dddddd;
  padding-top: 16px;
}

/* 按钮区域：右对齐 */
.login-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.login-btn {
  padding: 6px 16px;
  border-color: #d4d4d8;
  color: #444;
  background-color: #f4f4f5;
  font-weight: 500;
}

.login-btn:hover{
  border-color: #a1a1aa;
  background-color: #e4e4e7;
  color: #111;
}

.login-btn:active {
  background-color: #d4d4d8;
}

</style>
