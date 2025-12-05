import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './store/authStore';

const routes = [
  {
    path: '/',
    redirect: '/game'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('./views/AuthView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('./views/GameView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('./views/LeaderboardView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/ProfileView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Навигационная охрана
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/game');
  } else {
    next();
  }
});

export default router;

