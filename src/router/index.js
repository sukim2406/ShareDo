import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { authService } from '../firebase-auth'
// import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: loginRequired

  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }, 
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('../views/Register.vue')
  // },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/CreateTask.vue')
  },
  {
    path: '/root',
    name: 'Root',
    component: () => import('../views/Root.vue')
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
