<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import BookCard from '../components/BookCard.vue'
import SearchFilters from '../components/SearchFilters.vue'
import { useFavorites } from '../modules/useFavorites'
import { useBooks } from '../modules/useBooks'

// Hent bøger
const router = useRouter()
const { loading, error, books, fetchBooks } = useBooks()
const searchTitle = ref('')
const searchGenre = ref('')
const browseGenre = ref('')
const sortBy = ref('rating')
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

const filteredAndSortedBooks = computed(() => {
  const filtered = books.value.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(searchTitle.value.toLowerCase())
    const genreMatch = !searchGenre.value || book.genre?.toLowerCase().includes(searchGenre.value.toLowerCase())

    return titleMatch && genreMatch
  })

  if (sortBy.value === 'rating') {
    filtered.sort((firstBook, secondBook) => (secondBook.rating || 0) - (firstBook.rating || 0))
  } else {
    filtered.sort(
      (firstBook, secondBook) =>
        new Date(secondBook.publishedDate || 0).getTime() - new Date(firstBook.publishedDate || 0).getTime()
    )
  }

  return filtered
})

const hasActiveFilters = computed(() => {
  return Boolean(searchTitle.value.trim() || searchGenre.value || sortBy.value !== 'rating')
})

// Få de højeste ratede bøger
const highestRatedBooks = computed(() => {
  return [...books.value]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4)
})

const topSectionBooks = computed(() => {
  return hasActiveFilters.value ? filteredAndSortedBooks.value : highestRatedBooks.value
})

// Få unikke genres
const availableGenres = computed(() => {
  const genres = new Set(books.value.map(book => book.genre).filter(Boolean))
  return Array.from(genres).sort()
})

const booksForBrowse = computed(() => {
  if (!browseGenre.value) {
    return books.value
  }

  return books.value.filter((book) => book.genre === browseGenre.value)
})

// Gruppér efter genre
const groupedBooks = computed(() => {
  return booksForBrowse.value.reduce((acc: any, book: any) => {
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

    <SearchFilters
      :searchTitle="searchTitle"
      :searchGenre="searchGenre"
      :sortBy="sortBy"
      :availableGenres="availableGenres"
      :resultCount="filteredAndSortedBooks.length"
      @update:searchTitle="searchTitle = $event"
      @update:searchGenre="searchGenre = $event"
      @update:sortBy="sortBy = $event"
    />

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

      <!-- TOP SECTION -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-white">
            {{ hasActiveFilters ? 'Search Results' : 'Highest Rated' }}
          </h2>
          <router-link
            v-if="!hasActiveFilters"
            to="/books/highest-rated"
            class="text-purple-400 hover:text-purple-300 text-sm"
          >
            View all
          </router-link>
        </div>

        <div
          v-if="topSectionBooks.length === 0"
          class="rounded-xl border border-gray-800 bg-gray-900/60 p-6 text-gray-400"
        >
          No books found for your current filters.
        </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
        >
          <BookCard
            v-for="book in topSectionBooks"
            :key="book._id"
            :book="book"
            :showFavorite="true"
            :favoriteActive="isFavorite(book._id)"
            :favoriteDisabled="favoritePendingIds.includes(book._id) || favoritesLoading"
            @select="goToBook(book._id)"
            @toggleFavorite="handleFavorite(book._id)"
          />
        </div>
      </div>

      <!-- BROWSE BY GENRE SECTION -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-white mb-6">
          Browse by Genre
        </h2>

        <div class="flex flex-wrap gap-3 mb-8">
          <button
            @click="browseGenre = ''"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition',
              browseGenre === ''
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            All Genres
          </button>

          <button
            v-for="genre in availableGenres"
            :key="genre"
            @click="browseGenre = genre"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition',
              browseGenre === genre
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

            <BookCard
              v-for="book in genreBooks"
              :key="book._id"
              :book="book"
              :showFavorite="true"
              :favoriteActive="isFavorite(book._id)"
              :favoriteDisabled="favoritePendingIds.includes(book._id) || favoritesLoading"
              @select="goToBook(book._id)"
              @toggleFavorite="handleFavorite(book._id)"
            />

          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
</style>
