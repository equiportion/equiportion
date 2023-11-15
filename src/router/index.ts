import { createRouter, createWebHistory } from 'vue-router';
import RoomOverviewView from '../views/RoomOverviewView.vue';
import LandingPageView from '@/views/LandingPageView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RoomOverviewView
    },
    {
      path: '/welcome',
      name: 'landing-page',
      component: LandingPageView
    }
  ]
})

export default router
