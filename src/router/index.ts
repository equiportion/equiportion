import {createRouter, createWebHistory} from 'vue-router';
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';
import {getCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {top: 0};
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/RoomOverviewView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePageView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/transactions/:roomId',
      name: 'transactions',
      component: () => import('@/views/TransactionOverviewView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/new-transaction/:roomId',
      name: 'new-transaction',
      component: () => import('@/views/NewTransactionView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/offline',
      name: 'offline',
      component: () => import('@/views/OfflineView.vue'),
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

  // Quick synchronous check: if no access token cookie exists, redirect to login immediately
  if (!getCookie(cookieNames.accessToken)) {
    return {name: 'login'};
  }

  // Create client in the background (non-blocking). If auth turns out to be
  // invalid (e.g. expired token), the sync loop will fail and the user stays
  // on an empty skeleton view until they manually log out / token refreshes.
  AuthenticatedMatrixClient.createClient().catch((error) => {
    console.error('Authentication failed:', error);
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
