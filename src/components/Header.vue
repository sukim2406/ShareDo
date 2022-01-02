<template>
    <nav class="navbar navbar-expand-lg navbar-dark nav">
        <div class="container">
            <a href="#" class="navbar-brand">Share-Do</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
                <span class="navbar-toggler-icon"> </span>
            </button>
            <div class="collapse navbar-collapse" id="navmenu" :key="loggedIn">
                <ul class="navbar-nav ms-auto" v-if="loggedIn == 0">
                    <li class="nav-item">
                        <router-link to="/login" class="nav-link">Log In</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/register" class="nav-link">Register</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/about" class="nav-link">About</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto" v-else>
                    <li class="nav-item">
                        <router-link to="/" class="nav-link">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/info" class="nav-link">My Info</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/create" class="nav-link">Create Task</router-link>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" @click="LogOut">Log Out</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
// import { authService } from '../firebase-auth'
import { onBeforeMount, ref } from 'vue'
import firebase from 'firebase'
import { authService } from '../firebase-auth'

export default {
    setup(){

        const loggedIn = ref('')
    
        onBeforeMount(async () => {    
            firebase.auth().onAuthStateChanged((user) => {
                if(!user) {
                    loggedIn.value = 0
                }
                else {
                    loggedIn.value = 1
                }
            })
        })

        const LogOut = () => {
            authService.logout()
        }

        return {
            loggedIn,
            LogOut
        }
    }
}
</script>

<style scoped>
    * {
        height: 5vh;
    }
    .nav{
        background: #000;
    }
</style>