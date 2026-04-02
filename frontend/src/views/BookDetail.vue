<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const book = ref(null)

onMounted(() => {
  const id = route.params.id

  // midlertidig mock data
  book.value = {
    id,
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'En dreng opdager, at han er troldmand...',
    rating: 4.8,
    imageUrl: 'https://via.placeholder.com/200',
    pages: 320,
    publishedDate: '1997-06-26'
  }
})
</script>

<template>
  <div v-if="book" class="p-6">
    
    <div class="flex gap-8">
      <img
        :src="book.imageUrl"
        alt="Book cover"
        class="w-60 rounded-lg shadow-md"
      />

      <div>
        <h1 class="text-3xl font-bold mb-2">{{ book.title }}</h1>
        <h2 class="text-xl text-gray-600 mb-4">{{ book.author }}</h2>

        <p class="mb-2"><strong>Genre:</strong> {{ book.genre }}</p>
        <p class="mb-2"><strong>Rating:</strong> ⭐ {{ book.rating }}</p>
        <p class="mb-2"><strong>Sider:</strong> {{ book.pages }}</p>

        <p class="mt-4 text-gray-700">{{ book.description }}</p>
      </div>
    </div>

  </div>
</template>