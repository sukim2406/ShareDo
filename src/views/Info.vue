<template>
  <head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
  </head>
  <div class="header-container">
    <Header />
  </div>  
  <div class="main-container">
    <div class="sidebar-container">

    </div>
    <div class="info-container">

    </div>
  </div>
  <div class="footer-container">
    <Footer />
  </div>
  <!-- <div class="card card-body mt-4">
    <h1>Info, {{ email }}</h1>
    <form @submit.prevent="update">
      <div class="form-group">
        <label>Name</label>
        <input v-model="name" class="form-control" required />
        <br>
        <label>Department</label>
        <input v-model="depart" class="form-control" />
        <br>
        <label>Greet</label>
        <input v-model="greet" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary mt-3" @click="Update">Update</button>    
    </form>
  </div> -->
</template>

<style scoped>
  .main-container{
    background: chartreuse;
    height: 85vh;
    display: flex;
    flex-direction: row;
  }

  .sidebar-container{
    background: grey;
    width: 30vw;
  }

  .info-container{
    background: cornflowerblue;
    width: 70vw;
  }
</style>

<script>
import { ref, onBeforeMount } from 'vue'
import { authService } from '../firebase-auth'
import { userService } from '../firebase-store'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  },

  setup (){
    const router = useRouter()
    const email = ref('')
    const uid = ref('')
    const name = ref('')
    const depart = ref('')
    const greet = ref('')

    onBeforeMount(async () => {
        await authService.authenticated()
        console.log(authService.user.email)
        email.value = authService.user.email
        uid.value = authService.user.uid

        await userService.getUserName(uid.value)
        name.value = userService.doc.data().name
        depart.value = userService.doc.data().depart
        greet.value = userService.doc.data().greet
        console.log("this", name.value)
    })
    // onUpdated(async () =>{
    //   await userService.getUserName(uid.value)
    //   name.value = userService.doc.name
    //   console.log("this", name.value)
    // })

    const Update = async() => {
      await userService.updateUser({
        name: name.value,
        depart: depart.value,
        greet: greet.value})
        .then(router.replace('/'))
        .catch((error) => {
          alert("somthing went wrong", error)
        })
    }


    return {
      email,
      name,
      depart,
      greet,
      uid,
      Update
    }
  },


}
</script>