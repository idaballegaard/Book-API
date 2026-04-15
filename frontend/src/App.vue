<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { clearAuthState, getStoredUser } from './modules/useAuth'

const router = useRouter()
const route = useRoute()

const user = ref()

const loadUser = () => {
  user.value = getStoredUser()
}

// læs user første gang
loadUser()

// læs user igen når route skifter
watch(
  () => route.fullPath,
  () => {
    loadUser()
  }
)

const logout = () => {
  clearAuthState()
  user.value = null
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col text-white bg-gradient-to-br from-gray-900 to-black">
    
    <!-- 🔝 NAVBAR -->
    <nav class="bg-gray-800 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <!-- Logo -->
        <div 
          class="flex items-center gap-3 cursor-pointer group"
          @click="router.push('/')"
        >
          <div class="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            📖
          </div>

          <span class="text-xl font-semibold tracking-wide group-hover:text-purple-400 transition">
            Readly
          </span>
        </div>

        <!-- Navigation links -->
        <div class="flex items-center gap-6 text-sm">

          <router-link to="/" class="hover:text-purple-400 transition">
            Home
          </router-link>

          <router-link to="/books" class="hover:text-purple-400 transition">
            Genrer
          </router-link>

          <router-link to="/profile" class="hover:text-purple-400 transition">
            Profile
          </router-link>
          
          <!-- Hvis user findes -->
          <template v-if="user">
            <span class="text-gray-400 text-sm">
              {{ user.email }}
            </span>

            <button
              @click="logout"
              class="hover:text-purple-400 transition"
            >
              Logout
            </button>
          </template>

          <!-- Hvis user IKKE findes -->
          <template v-else>
            <router-link to="/login" class="hover:text-purple-400 transition">
              Login
            </router-link>
          </template>

        </div>

      </div>
    </nav>

    <!-- CONTENT -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- FOOTER -->
    <footer class="bg-gray-900 border-t border-gray-800 text-white pb-8">
      <div class="max-w-6xl mx-auto px-6 pt-8">

        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="text-xl font-semibold text-purple-400">
            📚 BookApp
          </div>

          <div class="flex gap-6 text-gray-400 text-sm">
            <a href="#" class="hover:text-white transition">Home</a>
            <a href="#" class="hover:text-white transition">Explore</a>
            <a href="#" class="hover:text-white transition">About</a>
            <a href="#" class="hover:text-white transition">Contact</a>
          </div>
        </div>

        <div class="border-t border-gray-800 my-6"></div>

        <div class="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-2">
          <p>© {{ new Date().getFullYear() }} BookApp. All rights reserved.</p>
          <p>Built with Vue & Tailwind</p>
        </div>

      </div>
    </footer>

  </div>
</template>

<style scoped>
</style>
