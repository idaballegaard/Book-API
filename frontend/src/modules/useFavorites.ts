import { ref } from 'vue'
import { getAuthToken } from './useAuth'
import { API_BASE_URL } from '../config/api'

function getAuthHeaders() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('You must be logged in')
  }

  return {
    'Content-Type': 'application/json',
    'auth-token': token
  }
}

export function useFavorites() {
  const favoriteBookIds = ref<string[]>([])
  const favoriteBooks = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchFavorites = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
        headers: getAuthHeaders()
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to load favorites')
      }

      favoriteBookIds.value = result.data.favoriteBookIds ?? []
      favoriteBooks.value = result.data.favoriteBooks ?? []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load favorites'
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async (bookId: string) => {
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/user/favorites/${bookId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to update favorites')
      }

      favoriteBookIds.value = result.data.favoriteBookIds ?? []
      favoriteBooks.value = result.data.favoriteBooks ?? []
      return result.data.isFavorite as boolean
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to update favorites'
      return false
    }
  }

  const isFavorite = (bookId: string) => {
    return favoriteBookIds.value.includes(bookId)
  }

  return {
    favoriteBookIds,
    favoriteBooks,
    loading,
    error,
    fetchFavorites,
    toggleFavorite,
    isFavorite
  }
}
