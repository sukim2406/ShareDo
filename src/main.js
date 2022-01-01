import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './firebase-auth.js'
import 'bootstrap/dist/js/bootstrap.js' 

createApp(App).use(router).mount('#app')
