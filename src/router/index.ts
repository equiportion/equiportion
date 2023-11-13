import { createRouter, createWebHistory } from 'vue-router';
import RoomOverviewView from '../views/RoomOverviewView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RoomOverviewView
    }
  ]
})

export default router
