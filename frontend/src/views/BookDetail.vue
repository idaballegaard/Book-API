<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const book = ref<any>(null)

onMounted(() => {
  const id = route.params.id

  book.value = {
    id,
    title: 'Test bog',
    author: 'Test forfatter',
    genre: 'Fantasy',
    description: 'Test beskrivelse',
    rating: 4.5,
    imageUrl: 'https://via.placeholder.com/200',
    pages: 300
  }
})
</script>

<template>
  <div>
    <h1>TEST SIDE</h1>

    <div v-if="book">
      <h2>{{ book.title }}</h2>
      <p>{{ book.author }}</p>
    </div>
  </div>
</template>