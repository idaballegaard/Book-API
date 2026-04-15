import { createRouter, createWebHistory } from 'vue-router'
import BookDetail from '../views/BookDetail.vue'
import BookList from '../views/BookList.vue'
import { isAuthenticated } from '../modules/useAuth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/books',
    name: 'Books',
    component: BookList,
    meta: { requiresAuth: true }
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: BookDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ROUTE GUARD
router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router
