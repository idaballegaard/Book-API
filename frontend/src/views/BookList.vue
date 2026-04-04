<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBooks } from '../modules/useBooks'

const router = useRouter()
const { loading, error, books, fetchBooks } = useBooks()

onMounted(() => {
  fetchBooks()
})

const goToBook = (id: string) => {
  router.push(`/books/${id}`)
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white p-8">
    
    <!-- 🔥 Title -->
    <h1 class="text-3xl font-bold mb-8 text-purple-400">
      📚 Udforsk bøger
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-400">
      Loading...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <!-- 📚 Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      
      <div
        v-for="book in books"
        :key="book.id"
        @click="goToBook(book._id)"
        class="cursor-pointer group"
      >
        
        <!-- Card -->
        <div class="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300">
          
          <!-- Cover -->
          <div class="overflow-hidden">
            <img
              :src="book.imageUrl"
              alt="Book cover"
              class="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          <!-- Info -->
          <div class="p-3">
            
            <h2 class="text-sm font-semibold line-clamp-2">
              {{ book.title }}
            </h2>

            <p class="text-xs text-gray-400">
              {{ book.author }}
            </p>

            <!-- Rating -->
            <p class="text-purple-400 text-sm mt-1">
              ⭐ {{ book.rating }}
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
</style>