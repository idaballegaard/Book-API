import { getStoredUser } from './useAuth'

export const getFavorites = (email: string) => {
  const data = JSON.parse(localStorage.getItem('favorites') || '{}')
  return data[email] || []
}

export const saveFavorites = (email: string, favs: string[]) => {
  const data = JSON.parse(localStorage.getItem('favorites') || '{}')
  data[email] = favs
  localStorage.setItem('favorites', JSON.stringify(data))
}

export const toggleFavorite = (id: string) => {
  const user = getStoredUser()
  if (!user) return

  let favs = getFavorites(user.email)

  if (favs.includes(id)) {
    favs = favs.filter((f: string) => f !== id)
  } else {
    favs.push(id)
  }

  saveFavorites(user.email, favs)
}

export const isFavorite = (id: string) => {
  const user = getStoredUser()
  if (!user) return false

  const favs = getFavorites(user.email)
  return favs.includes(id)
}
