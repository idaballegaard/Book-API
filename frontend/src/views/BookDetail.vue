<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const book = ref<any>(null)

onMounted(() => {
  const id = route.params.id

  // Midlertidig data (API kobles på senere)
  book.value = {
    id,
    title: 'Harry Potter og De Vises Sten',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description:
      'En forældreløs dreng opdager, at han er en troldmand og starter på Hogwarts, hvor han møder venner, magi og sin skæbne.',
    rating: 4.8,
    imageUrl: 'https://via.placeholder.com/300x450',
    pages: 320,
    publishedDate: '1997-06-26'
  }
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-10">
    
    <div v-if="book" class="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      
      <div class="flex flex-col md:flex-row gap-10">
        
        <!-- 📚 Cover -->
        <div class="flex justify-center">
          <img
            :src="book.imageUrl"
            alt="Book cover"
            class="w-64 rounded-xl shadow-md hover:scale-105 transition duration-300"
          />
        </div>

        <!-- 📖 Info -->
        <div class="flex-1">
          
          <h1 class="text-4xl font-bold mb-2">
            {{ book.title }}
          </h1>

          <h2 class="text-xl text-gray-600 mb-4">
            af {{ book.author }}
          </h2>

          <!-- Metadata -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span>📚 {{ book.genre }}</span>
            <span>📄 {{ book.pages }} sider</span>
            <span>📅 {{ new Date(book.publishedDate).getFullYear() }}</span>
          </div>

          <!-- Rating -->
          <div class="mb-6">
            <span class="text-yellow-500 text-xl font-semibold">
              ⭐ {{ book.rating }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-gray-700 leading-relaxed text-lg">
            {{ book.description }}
          </p>

        </div>

      </div>

    </div>

    <!-- Loading -->
    <div v-else class="text-center mt-20 text-gray-500 text-lg">
      Loading book...
    </div>

  </div>
</template>

<style scoped>
</style>