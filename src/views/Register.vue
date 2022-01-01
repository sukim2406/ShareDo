<template>
    <div class="register">
        <h1>REGISTER</h1> 
        <form @submit.prevent="Register">
            <input class="form-control" placeholder="Email" v-model="form.email" required />
            <br>
            <input class="form-control" placeholder="Email Confirm" v-model="form.emailConfirm" required />
            <br>
            <input type="password" placeholder="Password" v-model="form.password" required />
            <br>
            <input type="password" placeholder="Password Confirm" v-model="form.passwordConfirm" required />
            <br>
            <input class="form-control" placeholder="Screen Name" v-model="form.name" required />
            <br>
            <input class="form-control" placeholder="Department" v-model="form.depart" /> 
            <br>
            <input class="form-control" placeholder="Greet" v-model="form.greet" />
            <br>
            <button type="submit" class="btn btn-success mt-3">Submit</button>
            <p>Have an account? <router-link to="/login">Login Here</router-link></p>
        </form>
    </div>
</template>

<script>
// import firebase from 'firebase';
import { ref } from 'vue';
import { reactive } from 'vue'
import { authService } from '../firebase-auth'
// import { addUser } from '../firebase-store'

export default {
    setup() {
        const form = reactive({
            name: '', 
            email: '', 
            emailConfirm: '',
            password: '', 
            depart: '', 
            greet: ''})
        const uid = ref("")

        const Register = async () => {
            if(form.email === form.emailConfirm && form.password === form.passwordConfirm){
                await authService.register({...form})
                form.name = ''
                form.email = ''
                form.emailConfirm = ''
                form.password = ''
                form.passwordConfirm = ''
                form.depart = ''
                form.greet = ''

            }
            else{
                alert("please check your information")
            }
        }

        return { form, uid, Register }
    }
}
</script>