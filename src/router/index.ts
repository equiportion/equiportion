import {createRouter, createWebHistory} from 'vue-router';
import RoomOverviewView from '../views/RoomOverviewView.vue';
import LandingPageView from '@/views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import EnterHomeserverView from '@/views/EnterHomeserverView.vue';
import ProfilePageView from '@/views/ProfilePageView.vue';

import NewTransactionView from '@/views/NewTransactionView.vue';
import TransactionOverviewView from '@/views/TransactionOverviewView.vue';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';

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
      path: '/login/homeserver',
      name: 'enter-homeserver',
      component: EnterHomeserverView,
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
  ],
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) {
    return;
  }

  AuthenticatedMatrixClient.createClient().catch(() => {
    router.push({name: 'login'});
  });
});

export default router;
