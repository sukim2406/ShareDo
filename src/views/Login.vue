<template>
    <head>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
    </head>
    <div class="body-container">
        <div class="container" :class="mode">
            <div class="panels-container">
                <div class="signin-signup">
                    <!-- Sign in form -->
                    <form action="" class="sign-in-form" @submit.prevent="Login">
                        <h2 class="title">Sign in</h2>
                        <div class="input-field">
                            <i class="fas fa-envelope"></i>
                            <input type="text" placeholder="Email" v-model="email" required>
                        </div>
                        <div class="input-field">
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password" v-model="password" required>
                        </div>
                        <input type="submit" value="Login" class="btn">
                        <p class="social-text">Or Sign in with social platform</p>
                        <div class="social-media" @click="SnsBtn">
                            <a href="#" class="social-icon">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-google"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </form>
                    <!-- Sign up form -->
                    <form action="" class="sign-up-form" @submit.prevent="Register">
                        <h2 class="title">Sign up</h2>
                        <div class="input-field">
                            <i class="fas fa-envelope"></i>
                            <input type="text" placeholder="Email" v-model="email" required>
                        </div>
                        <div class="input-field">
                            <i class="fas fa-envelope"></i>
                            <input type="text" placeholder="Email Confirm" v-model="emailConfirm" required>
                        </div>
                        <div class="input-field">
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password" v-model="password" required>
                        </div>
                        <div class="input-field">
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password Confirm" v-model="passwordConfirm" required>
                        </div>
                        <div class="input-field">
                            <i class="fas fa-user"></i>
                            <input type="text" placeholder="Screen Name" v-model="name" required>
                        </div>
                        <div class="input-field">
                            <i class="fas fa-address-card"></i>
                            <input type="text" placeholder="Department" v-model="department">
                        </div>
                        <div class="input-field">
                            <i class="fas fa-comment"></i>
                            <input type="text" placeholder="Greet" v-model="greet">
                        </div>
                        <input type="submit" value="Sign up" class="btn">
                        <p class="social-text">Or Sign up with social platform</p>
                        <div class="social-media" @click="SnsBtn">
                            <a href="#" class="social-icon">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-google"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </form>
                </div>
                <div class="panels-container">
                    <div class="panel left-panel">
                        <div class="content">
                            <h3>Member of Sharedo?</h3>
                            <p>Create, share, and manage tasks together!</p>
                            <button class="btn" id="sign-in-btn" @click="SignInMode">Sign in</button>
                        </div>
                        <img src="../assets/signinimg.svg" alt="" class="image">
                    </div>
                    <div class="panel right-panel">
                        <div class="content">
                            <h3>New to Sharedo?</h3>
                            <p>Start managing tasks together with others by signing up!</p>
                            <button class="btn" id="sign-up-btn" @click="SignUpMode">Sign up</button>
                        </div>
                        <img src="../assets/signupimg.svg" alt="" class="image">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { authService } from '../firebase-auth'

export default {
    setup() {
        const email = ref("")
        const password = ref("")
        const mode = ref("")
        const emailConfirm = ref("")
        const passwordConfirm = ref("")
        const name = ref("")
        const department = ref("")
        const greet = ref("")

        const Login = async() => {
            await authService.login(email.value, password.value)
            email.value = ''
            password.value = ''
        }

        const Register = async() => {
            if(email.value == emailConfirm.value && password.value === passwordConfirm.value){
                await authService.register(email.value, password.value, name.value, department.value, greet.value)
                email.value = ''
                emailConfirm.value = ''
                password.value = ''
                passwordConfirm.value = ''
                name.value = ''
                department.value = ''
                greet.value = ''
            }
            else{
                alert("please check your information")
            }
        }

        const SignInMode = () => {
            mode.value = ""
        }

        const SignUpMode = () => {
            mode.value = "sign-up-mode"
        }

        const SnsBtn = () => {
            alert("SNS login to be updated")
        }

        return {
            Login,
            Register,
            email,
            emailConfirm,
            password,
            passwordConfirm,
            name,
            department,
            greet,
            SignInMode,
            SignUpMode,
            SnsBtn,
            mode
        }
    }
}
</script>

<style scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }
    .body-container{
        display:  flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #000;
    }
    .container{
        position: relative;
        width: 100vw;
        height: 100vh;
        background: #000;
        border-radius: 10px;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3), 0, 6px 20px 0 rgba(0, 0, 0, 0.3);
        overflow: hidden;

    }

    .container::before{
        content: "";
        position: absolute;
        top: 0;
        left: -50%;
        width: 100%;
        height: 100%;
        background: linear-gradient(-45deg, #009056, #014128);
        z-index: 6;
        transform: translateX(100%);
        transition: 1s ease-in-out;
    }
    .signin-signup{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        z-index: 5;
    }
    form{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 40%;
        min-height: 238px;
        padding: 0 10px;
    }

    form.sign-in-form{
        opacity: 1;
        transition: 0.5s ease-in-out;
        transition-delay: 1s;
    }

    form.sign-up-form{
        opacity: 0;
        transition: 0.5s ease-in-out;
        transition-delay: 1s;
    }

    .title{
        font-size: 35px;
        color: #009056;
        margin-bottom: 10px;
    }

    .input-field{
        width: 100%;
        height: 50px;
        background: #000;
        margin: 10px 0;
        border: 2px solid #009056;
        border-radius: 50px;
        display: flex;
        align-items: center;
    }

    .input-field i{
        flex: 1;
        text-align: center;
        color: #444;
        font-size: 18px;
    }

    .input-field input {
        flex: 5;
        background: none;
        border: none;
        outline: none;
        width: 100%;
        font-size: 18px;
        font-weight: 600;
        color: #444;
    }

    .btn{
        width: 150px;
        height: 50px;
        border: none;
        border-radius: 50px;
        background: #014128;
        color: #fff;
        font-weight: 600;
        margin: 10px 0;
        text-transform: uppercase;
        cursor: pointer;
    }

    .btn:hover{
        background: #009056;
    }

    .social-text{
        margin: 10px 0;
        font-size: 16px;
    }

    .social-media{
        display: flex;
        justify-content: center;
    }

    .social-icon{
        height: 45px;
        width: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #014128;
        border: 1px solid #014128;
        border-radius: 50px;
        margin: 0 5px;
    }

    a {
        text-decoration: none;
    }

    .social-icon:hover{
        color: #444;
        border-color: #444;
    }

    .panels-container{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 35%;
        min-width: 238px;
        padding: 0 10px;
        text-align: center;
        z-index: 6;
    }
    
    .left-panel{
        pointer-events: none;
    }

    .content{
        color: #fff;
        transition: 1.1s ease-in-out;
        transition-delay: 0.5s;
    }

    .panel h3{
        font-size: 24px;
        font-weight: 600;
    }

    .panel p{
        font-size: 15px;
        padding: 10px 0; 
    }
    .image{
        width: 100%;
        transition: 1.1s ease-in-out;
        transition-delay: 0.4s;
    }

    .left-panel .image,
    .left-panel .content {
        transform: translateX(-200%)
    }

    .right-panel .image,
    .right-panel .content {
        transform: translateX(0)
    }

    /* Animation */

    .container.sign-up-mode::before{
        transform: translateX(0);
    } 

    .container.sign-up-mode .right-panel .image,
    .container.sign-up-mode .right-panel .content {
        transform: translateX(200%)
    }

    .container.sign-up-mode .left-panel .image,
    .container.sign-up-mode .left-panel .content {
        transform: translateX(0)
    }

    .container.sign-up-mode form.sign-in-form{
        opacity: 0;
    }
    
    .container.sign-up-mode form.sign-up-form{
        opacity: 1;
    }

    .container.sign-up-mode .right-panel {
        pointer-events: none;
    }

    .container.sign-up-mode .left-panel {
        pointer-events: all;
    }


    /* Responsive */
    @media (max-width:779px){
        .container{
            width: 100vw;
            height: 100vh;
        }
    }
</style>