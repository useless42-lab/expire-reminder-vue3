import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthRouter from './auth';
import UserRouter from './user';
import ManageRouter from './manage';

const routes: Array<RouteRecordRaw> = [
  ...AuthRouter,
  ...UserRouter,
  ...ManageRouter,
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/index/index.vue')
  },
  {
    path: '/team/invite/:token',
    name: 'TeamInvite',
    component: () => import( /* webpackChunkName:"WebOverview" */ '../views/team/invite.vue')
  },
  {
    path:"/overview/list",
    name:"overview",
    component:()=>import('../views/overview/list.vue')
  },
  {
    path:"/overview/calendar",
    name:"calendar",
    component:()=>import('../views/overview/calendar.vue')
  },
  {
    path:"/user/overview",
    name:"UserOverview",
    component:()=>import('../views/user/overview.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
