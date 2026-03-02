import {createRouter, createWebHistory} from 'vue-router';
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';

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
