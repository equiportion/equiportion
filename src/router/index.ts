import {createRouter, createWebHistory} from 'vue-router';
import RoomOverviewView from '../views/RoomOverviewView.vue';
import LandingPageView from '@/views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import ProfilePageView from '@/views/ProfilePageView.vue';

import NewTransactionView from '@/views/NewTransactionView.vue';
import TransactionOverviewView from '@/views/TransactionOverviewView.vue';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';

import OfflineView from '@/views/OfflineView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RoomOverviewView,
      meta: {
        requiresAuth: true,
      },
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
      path: '/profile',
      name: 'profile',
      component: ProfilePageView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/transactions/:roomId',
      name: 'transactions',
      component: TransactionOverviewView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/new-transaction/:roomId',
      name: 'new-transaction',
      component: NewTransactionView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/offline',
      name: 'offline',
      component: OfflineView,
    },
  ],
});

/**
 * Auth handling
 */
router.beforeEach((to) => {
  if (!to.meta.requiresAuth) {
    return;
  }

  AuthenticatedMatrixClient.createClient().catch(() => {
    router.push({name: 'login'});
  });
});

/**
 * Offline handling
 */
router.beforeEach((to, from, next) => {
  if (!navigator.onLine) {
    localStorage.setItem('offlineRoute', from.fullPath);
  }
  next();
});

/**
 * Animations
 */
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length;
  const fromDepth = from.path.split('/').length;
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left';
});

export default router;
