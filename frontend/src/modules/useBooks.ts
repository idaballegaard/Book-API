import { ref } from 'vue'
//import type { Book } from '../../../backend/src/interfaces/book'

export function useBooks() {
  const books = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBooks = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('http://localhost:4000/api/books')
      const data = await response.json()

      books.value = data
    } catch (err) {
      error.value = 'Kunne ikke hente bøger'
    } finally {
      loading.value = false
    }
  }

  const fetchBookById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`http://localhost:4000/api/books/${id}`)
      const data = await response.json()

      books.value = [data] // Assuming the API returns a single book object
    } catch (err) {
      error.value = 'Kunne ikke hente bogen'
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    loading,
    error,
    fetchBooks,
    fetchBookById
  }
}