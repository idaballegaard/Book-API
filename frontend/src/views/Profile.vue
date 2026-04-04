<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFavorites } from '../modules/useFavorites'

const router = useRouter()

const user = ref<any>(null)
const favorites = ref<string[]>([])

// ⚠️ samme test data som BookList
const allBooks = [
  {
    _id: '1',
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    imageUrl: 'https://via.placeholder.com/200x300'
  },
  {
    _id: '2',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    imageUrl: 'https://via.placeholder.com/200x300'
  },
  {
    _id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    imageUrl: 'https://via.placeholder.com/200x300'
  },
  {
    _id: '4',
    title: '1984',
    author: 'George Orwell',
    imageUrl: 'https://via.placeholder.com/200x300'
  },
  {
    _id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    imageUrl: 'https://via.placeholder.com/200x300'
  }
]

const favoriteBooks = ref<any[]>([])

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('user') || 'null')

  if (!user.value) {
    router.push('/login')
    return
  }

  favorites.value = getFavorites(user.value.email)

  // 🔥 match IDs med bøger
  favoriteBooks.value = allBooks.filter(book =>
    favorites.value.includes(book._id)
  )
})

const goToBook = (id: string) => {
  router.push(`/books/${id}`)
}

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">

    <!-- 👤 USER -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-purple-400 mb-2">
        👤 Profile
      </h1>
      <p class="text-gray-400">
        {{ user?.email }}
      </p>
    </div>

    <!-- ❤️ FAVORITES -->
    <div>
      <h2 class="text-2xl font-semibold mb-6">
        ❤️ Your Favorites
      </h2>

      <div v-if="favoriteBooks.length === 0" class="text-gray-400">
        No favorites yet.
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        <div
          v-for="book in favoriteBooks"
          :key="book._id"
          @click="goToBook(book._id)"
          class="cursor-pointer group"
        >
          <div class="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition">

            <img
              :src="book.imageUrl"
              class="w-full h-64 object-cover group-hover:scale-105 transition"
            />

            <div class="p-3">
              <h3 class="text-sm font-semibold">
                {{ book.title }}
              </h3>

              <p class="text-xs text-gray-400">
                {{ book.author }}
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- 🚪 LOGOUT -->
    <div class="mt-12">
      <button
        @click="logout"
        class="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition"
      >
        Logout
      </button>
    </div>

  </div>
</template>