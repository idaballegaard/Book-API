<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useFavorites } from '../modules/useFavorites'
import { useBooks } from '../modules/useBooks'

// Hent bøger
const router = useRouter()
const { loading, error, books, fetchBooks } = useBooks()
const selectedGenre = ref('')
const {
  loading: favoritesLoading,
  error: favoritesError,
  fetchFavorites,
  toggleFavorite,
  isFavorite
} = useFavorites()

onMounted(async () => {
  await Promise.all([fetchBooks(), fetchFavorites()])
})

const favoritePendingIds = ref<string[]>([])

const handleFavorite = async (id: string) => {
  if (favoritePendingIds.value.includes(id)) {
    return
  }

  favoritePendingIds.value.push(id)

  try {
    await toggleFavorite(id)
  } finally {
    favoritePendingIds.value = favoritePendingIds.value.filter((pendingId) => pendingId !== id)
  }
}

const goToBook = (id: string) => {
  router.push(`/books/${id}`)
}

// Få de højeste ratede bøger
const highestRatedBooks = computed(() => {
  return [...books.value]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4)
})

// Få unikke genres
const availableGenres = computed(() => {
  const genres = new Set(books.value.map(book => book.genre).filter(Boolean))
  return Array.from(genres).sort()
})

// Filtrer bøger efter valgt genre
const booksBySelectedGenre = computed(() => {
  if (!selectedGenre.value) {
    return books.value
  }
  return books.value.filter(book => book.genre === selectedGenre.value)
})

// Gruppér efter genre
const groupedBooks = computed(() => {
  return booksBySelectedGenre.value.reduce((acc: any, book: any) => {
    const genre = book.genre || 'Other'
    if (!acc[genre]) acc[genre] = []
    acc[genre].push(book)
    return acc
  }, {})
})
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto">
    
    <!-- Title -->
    <h1 class="text-3xl font-bold mb-8 text-purple-400">
      Explore Books
    </h1>

    <!-- Search bar -->
    <div class="mb-8">
      <div class="relative">
        <input
          type="text"
          placeholder="Search for books, authors or genres..."
          class="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading || favoritesLoading" class="text-center text-gray-400">
      Loading...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <div v-else-if="favoritesError" class="text-center text-red-500">
      {{ favoritesError }}
    </div>

    <!-- Content -->
    <div v-else>

      <!-- HIGHEST RATED SECTION -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-white">
            Highest Rated
          </h2>
          <router-link to="/books/highest-rated" class="text-purple-400 hover:text-purple-300 text-sm">
            View all
          </router-link>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <div
            v-for="book in highestRatedBooks"
            :key="book._id"
            @click="goToBook(book._id)"
            class="cursor-pointer group"
          >
            <!-- CARD -->
            <div class="relative bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300">
              
              <!-- FAVORITE -->
              <button
                @click.stop="handleFavorite(book._id)"
                :disabled="favoritePendingIds.includes(book._id) || favoritesLoading"
                class="absolute top-2 right-2 text-xl z-10 disabled:opacity-60"
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
                <h3 class="truncate text-sm font-semibold group-hover:text-purple-400 transition">
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

      <!-- BROWSE BY GENRE SECTION -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-white mb-6">
          Browse by Genre
        </h2>

        <div class="flex flex-wrap gap-3 mb-8">
          <button
            @click="selectedGenre = ''"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition',
              selectedGenre === ''
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            All Genres
          </button>

          <button
            v-for="genre in availableGenres"
            :key="genre"
            @click="selectedGenre = genre"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition',
              selectedGenre === genre
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ genre }}
          </button>
        </div>
      </div>

      <!-- BOOKS BY SELECTED GENRE -->
      <div>
        <div
          v-for="(genreBooks, genre) in groupedBooks"
          :key="genre"
          class="mb-12"
        >
          
          <!-- Genre title -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-purple-400">
              {{ genre }}
            </h2>
            <router-link :to="`/genre/${genre}`" class="text-purple-400 hover:text-purple-300 text-sm">
              View all
            </router-link>
          </div>

          <!-- GRID -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

            <div
              v-for="book in genreBooks"
              :key="book._id"
              @click="goToBook(book._id)"
              class="cursor-pointer group"
            >

              <!-- CARD -->
              <div class="relative bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300">
                
                <!-- FAVORITE -->
                <button
                  @click.stop="handleFavorite(book._id)"
                  :disabled="favoritePendingIds.includes(book._id) || favoritesLoading"
                  class="absolute top-2 right-2 text-xl z-10 disabled:opacity-60"
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
                  <h3 class="truncate text-sm font-semibold group-hover:text-purple-400 transition">
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

  </div>
</template>

<style scoped>
</style>
