import { createRouter, createWebHistory } from 'vue-router'
import Assignment3 from '@/views/Assignment3.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/assignment3',
    },
    {
      path: '/assignment3',
      name: 'Assignment3',
      component: Assignment3,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/assignment3',
    },
  ],
})

export default router
