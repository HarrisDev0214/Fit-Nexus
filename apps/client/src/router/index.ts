import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/HomePage.vue') },
  { path: '/login', component: () => import('@/views/LoginPage.vue') }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
