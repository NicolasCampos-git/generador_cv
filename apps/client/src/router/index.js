import PostulantesView from '@/views/PostulantesView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: PostulantesView },
  ],
})

export default router
