<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const featuredBooks = [
  {
    _id: '1',
    title: 'Harry Potter',
    imageUrl: 'https://via.placeholder.com/200x300'
  },
  {
    _id: '2',
    title: 'The Hobbit',
    imageUrl: 'https://via.placeholder.com/200x300'
  },
  {
    _id: '3',
    title: 'Dune',
    imageUrl: 'https://via.placeholder.com/200x300'
  }
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">

    <!-- 🎬 HERO -->
    <div class="relative rounded-2xl overflow-hidden mb-16">

      <!-- 🖼️ DARK IMAGE -->
      <img
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66"
        class="w-full h-[400px] object-cover grayscale brightness-50"
      />

      <!-- 🌑 EXTRA OVERLAY -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- ✨ CONTENT -->
      <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
        <h1 class="text-5xl font-bold mb-4">
          Discover Your Next
          <span class="text-purple-400">Favorite Book</span>
        </h1>

        <p class="text-gray-300 max-w-xl mx-auto mb-6">
          Explore thousands of books across genres. Find what to read next.
        </p>

        <button
          @click="router.push('/books')"
          class="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition"
        >
          Browse Books
        </button>
      </div>

    </div>

    <!-- 📚 FEATURED -->
    <div>
      <h2 class="text-2xl font-semibold text-purple-400 mb-6">
        Featured Books
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

        <div
          v-for="book in featuredBooks"
          :key="book._id"
          @click="router.push(`/books/${book._id}`)"
          class="cursor-pointer group"
        >
          <div class="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition">

            <img
              :src="book.imageUrl"
              class="w-full h-64 object-cover group-hover:scale-105 transition"
            />

            <div class="p-3">
              <h3 class="text-sm font-semibold group-hover:text-purple-400 transition">
                {{ book.title }}
              </h3>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</template>