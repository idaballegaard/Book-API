<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { toggleFavorite, isFavorite } from '../modules/useFavorites'
import { useBooks } from '../modules/useBooks'

// 🔥 Hent bøger
const router = useRouter()
const { loading, error, books, fetchBooks } = useBooks()

onMounted(() => {
  fetchBooks()
})

// Test data
// const loading = ref(false)
// const error = ref(null)

// const books = ref([
  // {
  //   _id: '1',
  //   title: 'Harry Potter',
  //   author: 'J.K. Rowling',
  //   genre: 'Fantasy',
  //   rating: 4.8,
  //   imageUrl: 'https://via.placeholder.com/200x300'
  // },
  // {
  //   _id: '2',
  //   title: 'The Hobbit',
  //   author: 'J.R.R. Tolkien',
  //   genre: 'Fantasy',
  //   rating: 4.7,
  //   imageUrl: 'https://via.placeholder.com/200x300'
  // },
  // {
  //   _id: '3',
  //   title: 'Dune',
  //   author: 'Frank Herbert',
  //   genre: 'Sci-Fi',
  //   rating: 4.6,
  //   imageUrl: 'https://via.placeholder.com/200x300'
  // },
  // {
  //   _id: '4',
  //   title: '1984',
  //   author: 'George Orwell',
  //   genre: 'Sci-Fi',
  //   rating: 4.5,
  //   imageUrl: 'https://via.placeholder.com/200x300'
  // },
  // {
  //   _id: '5',
  //   title: 'Atomic Habits',
  //   author: 'James Clear',
  //   genre: 'Self Development',
  //   rating: 4.9,
  //   imageUrl: 'https://via.placeholder.com/200x300'
  // }
// ])

const handleFavorite = (id: string) => {
  toggleFavorite(id)
}

const goToBook = (id: string) => {
  router.push(`/books/${id}`)
}

// 🔥 Gruppér efter genre
const groupedBooks = computed(() => {
  return books.value.reduce((acc: any, book: any) => {
    const genre = book.genre || 'Other'
    if (!acc[genre]) acc[genre] = []
    acc[genre].push(book)
    return acc
  }, {})
})
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto">
    
    <!-- 🔥 Title -->
    <h1 class="text-3xl font-bold mb-8 text-purple-400">
      📚 Explore Books
    </h1>

    <!-- ⏳ Loading -->
    <div v-if="loading" class="text-center text-gray-400">
      Loading...
    </div>

    <!-- ❌ Error -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <!-- ✅ Content -->
    <div v-else>

      <!-- 🎯 GENRES -->
      <div
        v-for="(books, genre) in groupedBooks"
        :key="genre"
        class="mb-12"
      >
        
        <!-- Genre title -->
        <h2 class="text-xl font-semibold text-purple-400 mb-4">
          {{ genre }}
        </h2>

        <!-- 📚 GRID -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          <div
            v-for="book in books"
            :key="book._id"
            @click="goToBook(book._id)"
            class="cursor-pointer group"
          >

            <!-- CARD -->
            <div class="relative bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300">
              
              <!-- ❤️ FAVORITE -->
              <button
                @click.stop="handleFavorite(book._id)"
                class="absolute top-2 right-2 text-xl z-10"
              >
                <span v-if="isFavorite(book._id)">❤️</span>
                <span v-else>🤍</span>
              </button>

              <!-- COVER -->
              <div class="overflow-hidden">
                <img
                  :src="book.imageUrl"
                  alt="Book cover"
                  class="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <!-- INFO -->
              <div class="p-3">
                <h3 class="text-sm font-semibold line-clamp-2 group-hover:text-purple-400 transition">
                  {{ book.title }}
                </h3>

                <p class="text-xs text-gray-400">
                  {{ book.author }}
                </p>

                <p class="text-purple-400 text-sm mt-1">
                  ⭐ {{ book.rating }}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
</style>