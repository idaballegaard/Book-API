import { createRouter, createWebHistory } from 'vue-router'
import BookDetail from '../views/BookDetail.vue'
import BookList from '../views/BookList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: BookList
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: BookDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router