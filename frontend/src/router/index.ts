import { createRouter, createWebHistory } from 'vue-router'
import BookDetail from '../views/BookDetail.vue'

const routes = [
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router