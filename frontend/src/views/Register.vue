<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../modules/useAuth'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const register = async () => {
  error.value = ''
  loading.value = true

  try {
    await registerUser(name.value, email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to register user'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[70vh] px-6">
    <div class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-purple-400">
        Register
      </h1>

      <p class="text-gray-400 mb-6">
        Create a new account to continue.
      </p>

      <form @submit.prevent="register">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

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
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <router-link
        to="/login"
        class="mt-4 inline-block text-sm text-purple-300 hover:text-purple-200 transition"
      >
        Already have an account? Login here.
      </router-link>
    </div>
  </div>
</template>