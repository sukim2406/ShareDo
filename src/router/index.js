import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { authService } from '../firebase-auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: loginRequired

  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/CreateTask.vue')
  },
  {
    path: '/info',
    name: 'Info',
    component: () => import('../views/Info.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function loginRequired(to, from, next) {
  if(authService.authenticated()){
    next()
  }
  else('/login')
}

export default router
