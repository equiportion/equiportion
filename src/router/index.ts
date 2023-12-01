import {createRouter, createWebHistory} from 'vue-router';
import RoomOverviewView from '../views/RoomOverviewView.vue';
import LandingPageView from '@/views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import EnterHomeserverView from '@/views/EnterHomeserverView.vue';
import ProfilePageView from '@/views/ProfilePageView.vue';
import TransactionOverviewViewVue from '@/views/TransactionOverviewView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RoomOverviewView,
    },
    {
      path: '/welcome',
      name: 'landing-page',
      component: LandingPageView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/login/homeserver',
      name: 'enter-homeserver',
      component: EnterHomeserverView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePageView,
    },
    {
      path: '/transactions/:roomId',
      name: 'transactions',
      component: TransactionOverviewViewVue,
    }
  ],
});

export default router;
