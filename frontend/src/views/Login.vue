<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../modules/useAuth'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    await loginUser(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[70vh] px-6">
    <div class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-purple-400">
        Login
      </h1>

      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

        <p v-if="error" class="text-red-400 mb-4">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-500 hover:bg-purple-600 py-3 rounded font-semibold transition disabled:opacity-60"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>
