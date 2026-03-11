<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const AUTH_STORAGE = 'ue-stc-auth'

onMounted(() => {
  if (sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc/dashboard')
  }
})

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
}

const VALID_USER = 'ue-stc'
const VALID_PASSWORD_HASH = '73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049'

async function onSubmit(e) {
  e.preventDefault()
  error.value = ''
  const u = username.value.trim()
  const p = password.value
  if (!u || !p) {
    error.value = '请输入账号与门钥'
    return
  }
  const hash = await sha256(p)
  if (u === VALID_USER && hash === VALID_PASSWORD_HASH) {
    sessionStorage.setItem(AUTH_STORAGE, '1')
    router.replace('/ue-stc/dashboard')
  } else {
    error.value = '账号或门钥错误，无法接入'
  }
}
</script>

<template>
  <div class="command-login">
    <div class="login-panel">
      <h1 class="login-title">UE-STC</h1>
      <p class="login-subtitle">Unseen Entity Surveillance & Tactical Command</p>
      <p class="login-subtitle-zh">不可见实体监视与战术指挥部 · 接入验证</p>
      <form class="login-form" @submit="onSubmit">
        <label class="field">
          <span class="field-label">账号</span>
          <input v-model="username" type="text" autocomplete="username" class="field-input" />
        </label>
        <label class="field">
          <span class="field-label">门钥</span>
          <input v-model="password" type="password" autocomplete="current-password" class="field-input" />
        </label>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn">接入</button>
      </form>
      <p class="hint">门钥于伪装界面中可寻。</p>
      <p class="back-link"><RouterLink to="/">返回协会页面</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.command-login {
  min-height: 100vh;
  background: #0a0a0a;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.login-panel {
  width: 100%;
  max-width: 320px;
}

@media (max-width: 640px) {
  .command-login {
    padding: 1rem 0.75rem;
  }
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #8b8b8b;
  margin-bottom: 0.25rem;
}

.login-subtitle {
  font-size: 0.7rem;
  color: #666;
  letter-spacing: 0.05em;
  margin-bottom: 0.15rem;
}

.login-subtitle-zh {
  font-size: 0.75rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.8rem;
  color: #888;
}

.field-input {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #ccc;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
}

.field-input:focus {
  outline: none;
  border-color: #555;
}

.error {
  font-size: 0.85rem;
  color: #a44;
  margin: 0;
}

.btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2a2a2a;
  border: 1px solid #444;
  color: #aaa;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn:hover {
  background: #333;
  color: #ccc;
}

.hint {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  color: #555;
}

.back-link {
  margin-top: 1rem;
  font-size: 0.85rem;
}

.back-link a {
  color: #555;
}

.back-link a:hover {
  color: #888;
}
</style>
