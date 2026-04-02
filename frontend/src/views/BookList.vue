<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Books</h2>

    <div v-if="loading" class="text-center">Loading...</div>

    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <div v-else class="flex flex-wrap -mx-2">
      <div
        v-for="book in books"
        :key="book.id"
        class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
      >
        <div class="bg-white p-4 rounded-lg shadow-md">
          
          <img
            :src="book.imageUrl"
            alt="Book cover"
            class="w-full h-48 object-cover mb-4 rounded-lg"
          />

          <h3 class="text-lg text-gray-700 font-semibold mb-2">
            {{ book.title }}
          </h3>

          <p class="text-gray-600">
            {{ book.author }}
          </p>

          <p class="text-gray-700 mt-2">
            {{ book.description }}
          </p>

          <p class="text-sm text-gray-500 mt-2">
            Genre: {{ book.genre }}
          </p>

          <div class="mt-4">
            <button class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
              Se detaljer
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBooks } from '../modules/useBooks' // ny composable

const { loading, error, books, fetchBooks } = useBooks()

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
</style>