<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const book = ref<any>(null)

onMounted(() => {
  const id = route.params.id
  
  book.value = {
    id,
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description:
      'An orphaned boy discovers that he is a wizard and begins his journey at Hogwarts.',
    rating: 4.8,
    imageUrl: 'https://via.placeholder.com/300x450',
    pages: 320,
    publishedDate: '1997-06-26',
    _reviewedBy: '123'
  }
})
</script>

<template>
  <!-- 🌫️ BACKGROUND -->
  <div class="bg-gradient-to-b from-gray-900 to-black pt-12 pb-25 text-white">
    
    <!-- 📦 CONTAINER -->
    <div v-if="book" class="max-w-5xl mx-auto px-6">

      <!-- 🧱 MAIN CARD -->
      <div class="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">

        <!-- HERO -->
        <div class="flex flex-col md:flex-row gap-10 mb-10">
          
          <img
            :src="book.imageUrl"
            class="w-64 rounded-xl shadow-xl"
          />

          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-2">{{ book.title }}</h1>
            <h2 class="text-gray-400 mb-4">by {{ book.author }}</h2>

            <div class="text-purple-400 text-lg mb-4">
              ⭐ {{ book.rating }}
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {{ book.genre }}
              </span>
              <span class="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {{ book.pages }} pages
              </span>
            </div>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="mb-8">
          <h3 class="text-purple-400 mb-2 font-semibold">Description</h3>
          <p class="text-gray-300 leading-relaxed">
            {{ book.description }}
          </p>
        </div>

        <!-- INFO GRID -->
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-400 text-sm">Author</p>
            <p>{{ book.author }}</p>
          </div>

          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-400 text-sm">Year</p>
            <p>{{ new Date(book.publishedDate).getFullYear() }}</p>
          </div>

          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-400 text-sm">Pages</p>
            <p>{{ book.pages }}</p>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>