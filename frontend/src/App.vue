<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen text-white">
    
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

        <!-- Navigation -->
        <div class="flex items-center gap-6 text-sm">
          <button 
            @click="router.push('/')"
            class="hover:text-purple-400 transition"
          >
            Udforsk
          </button>

          <button class="text-gray-500 cursor-default">
            Genrer
          </button>
        </div>

      </div>
    </nav>

    <!-- 🔥 CONTENT (NO WRAPPER BUGS) -->
    <main class="bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <router-view />
    </main>

  </div>
</template>

<style scoped>
</style>