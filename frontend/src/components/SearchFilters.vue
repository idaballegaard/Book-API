<script setup lang="ts">
defineProps<{
  searchTitle: string
  searchGenre: string
  sortBy: string
  availableGenres: string[]
  resultCount: number
}>()

const emit = defineEmits<{
  'update:searchTitle': [value: string]
  'update:searchGenre': [value: string]
  'update:sortBy': [value: string]
}>()
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-lg mb-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Title search -->
      <div>
        <label class="block text-sm font-semibold text-gray-300 mb-2">
          Search by Title
        </label>
        <input
          :value="searchTitle"
          @input="emit('update:searchTitle', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Book title..."
          class="w-full p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <!-- Genre search -->
      <div>
        <label class="block text-sm font-semibold text-gray-300 mb-2">
          Filter by Genre
        </label>
        <select
          :value="searchGenre"
          @change="emit('update:searchGenre', ($event.target as HTMLSelectElement).value)"
          class="w-full p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Genres</option>
          <option v-for="genre in availableGenres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
      </div>

      <!-- Sort -->
      <div>
        <label class="block text-sm font-semibold text-gray-300 mb-2">
          Sort by
        </label>
        <select
          :value="sortBy"
          @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
          class="w-full p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="rating">Highest Rating</option>
          <option value="published">Newest Published</option>
        </select>
      </div>

      <!-- Results count -->
      <div class="flex items-end">
        <div class="text-sm text-gray-400">
          {{ resultCount }} book{{ resultCount !== 1 ? 's' : '' }} found
        </div>
      </div>
    </div>
  </div>
</template>
