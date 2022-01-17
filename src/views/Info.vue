<template>
  <head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
  </head>
  <div class="header-container">
    <Header />
  </div> 
  <div class="main-container">
    <div class="container">
      <div class="modal-container" v-if="modalTrigger">
        <ReauthModal newPassword="newPassword" @accepted = "GetData" @cancel = "ToggleModal"/>
      </div>
      <div class="sidebar-container">
        <div class="profile-container">
          <div class="profile-picture-container">
            <i class="fas fa-user-circle fa-7x"></i>
          </div>
          <div class="profile-info-container">
            <p>{{ email }}</p>
            <p>{{ form.name }}</p>
          </div>
        </div>
        <div class="btns-container">
          <button @click="SaveBtn">Save</button>
          <button @click="BackBtn">Back</button>
        </div>
      </div>
      <div class="info-container">
        <div class="personal-container">
          <div class="title-container">
            <h3>Personal Info Update</h3>
          </div>
          <div class="info-data-container">
            <div class="info-email">
              EMAIL
              <input type="text" v-model="email" disabled>
            </div>
            <div class="info-name">
              NAME
              <input type="text" v-model="form.name">
            </div>
            <div class="info-depart">
              DEPARTMENT
              <input type="text" v-model="form.depart">
            </div>
            <div class="info-greet">
              GREET
              <input type="text" v-model="form.greet">
            </div>
            <div class="info-newpassword">
              RESET PASSWORD
              <input type="password" v-model="form.password">
            </div>
            <div class="info-passwordconfirm">
              PASSWORD CONFIRM
              <input type="password" v-model="form.passwordConfirm">
            </div>          
          </div>  
        </div>
        <div class="stat-container">
          <div class="title-container">
            <h3>Task Statistics</h3>
          </div>
          <div class="stats-container">
            <div class="counter total-tasks">
              <p>Total</p>
              <h1>{{ numbTotal }}</h1>
            </div>
            <div class="counter open-tasks">
              <p>Open</p>
              <h1>{{ numbOpen }}</h1>
            </div>
            <div class="counter completed-tasks">
              <p>Completed</p>
              <h1>{{ numbCompleted }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mobile-btns-container">
    <button @click="SaveBtn">Save</button>
    <button @click="BackBtn">Back</button> 
  </div>
  <div class="footer-container">
    <Footer />
  </div>
</template>

<script>
import { ref, reactive, onBeforeMount } from 'vue'
import { authService } from '../firebase-auth'
import { taskService, userService } from '../firebase-store'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ReauthModal from '../components/ReauthModal.vue'

export default {
  components: {
    Header,
    Footer,
    ReauthModal,
  },

  setup (){
    const modalTrigger = ref(false)
    const tasks = ref([])
    const router = useRouter()
    const email = ref('')
    const uid = ref('')
    const numbTotal = ref(0)
    const numbOpen = ref(0)
    const numbCompleted = ref(0)

    const form = reactive ({
      name: '',
      depart: '',
      greet: '',
      password: '',
      passwordConfirm: '',
    })

    onBeforeMount(async () => {
        await authService.authenticated()
          .then(() => {
            email.value = authService.user.email
            uid.value = authService.user.uid
          })

        await userService.getUserName(uid.value)
          .then(() => {
            form.name = userService.doc.data().name
            form.depart = userService.doc.data().depart
            form.greet = userService.doc.data().greet
            tasks.value = userService.doc.data().tasks
          })
        tasks.value.forEach(async task => {
          await taskService.getTask(task.id)
            .then(() => {
              numbTotal.value += 1
              if(taskService.doc.data().completed){
                numbCompleted.value += 1
              }
              else{
                numbOpen.value += 1
              }
            })
        })
    })

    const SaveBtn = () => {
      if(form.password != ''){
        if(form.password != form.passwordConfirm){
          alert("Password does not match")
          return
        }
        else{
          ToggleModal()
        }
      }
      else{
        Update()
      }
    }

    const BackBtn = () =>{
      router.replace('/')
    }

    const Update = async() => {
      await userService.updateUser({
          name: form.name,
          depart: form.depart,
          greet: form.greet
        })
        .then(router.replace('/'))
        .catch((error) => {
          alert("somthing went wrong", error)
        })
    }

    const ResetPassword = async(curPassword, newPassword) => {
      await authService.passwordReset(curPassword, newPassword)
    }

    const ToggleModal = () => {
      modalTrigger.value = !modalTrigger.value
    }

    const GetData = async (value) => {
      await ResetPassword(value, form.password)
        .then(() => {
          modalTrigger.value = !modalTrigger.value
        })
    }


    return {
      modalTrigger,
      email,
      uid,
      form,
      numbTotal,
      numbOpen,
      numbCompleted,
      tasks,
      Update,
      SaveBtn,
      BackBtn,
      ResetPassword,
      ToggleModal,
      GetData,
    }
  },


}
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    background-color: black;
    color: white;
  }
  .main-container{
    background: black;
    height: 85vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .container{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .sidebar-container{
    background: black;
    width: 20vw;
    height: 85vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .profile-container{
    background-color: black;
    padding-top: 3vh;
    height: 40vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: top;
  }

  .profile-picture-container{
    display: flex;
    justify-content: center;
  }

  .profile-info-container{
    padding-top: 2vh;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .btns-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 5vh;
  }

  .btns-container button{
    margin-top: 3vh;
    align-items: center;
    border: none;
    width: 18vw;
    border-radius: 50px;
    background: #014128;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer
  }

  .btns-container button:hover{
    background-color: #009056;
  }

  .info-container{
    width: 70vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .personal-container{
    height: 50vh;
    display: flex;
    flex-direction: row;
  }

  .title-container{
    width: 20vw;
    text-align: center;
    background-color: #014128;
  }

  .personal-container .title-container h3{
    background-color: #014128;
  }

  .info-data-container{
    width: 50vw;
    height: 40vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .info-email{
    color: #009056;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  .info-email input{
    margin-left: 5vw;
    width: 30vw;
  }

  .info-name{
    color: #009056;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  .info-name input{
    margin-left: 5vw;
    width: 30vw;
  }

  .info-depart{
    color: #009056;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  .info-depart input{
    margin-left: 5vw;
    width: 30vw;
  }

  .info-greet{
    color: #009056;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  .info-greet input{
    margin-left: 5vw;
    width: 30vw;
  }

  .info-newpassword{
    color: #009056;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  .info-newpassword input{
    margin-left: 5vw;
    width: 30vw;
  }

  .info-passwordconfirm{
    color: #009056;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  .info-passwordconfirm input{
    margin-left: 5vw;
    width: 30vw;
  }

  .stat-container{
    height: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .stat-container .title-container{
    width: 70vw;
  }

  .stat-container .title-container h3{
    background-color: #014128;
  }

  .stats-container{
    display: flex;
    flex-direction: row;
    width: 70vw;
    justify-content: space-evenly;
  }

  .counter{
    width: 15vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: none;
    border-radius: 50px;
    background-color: #014128;
  }

  .counter p, h1{
    background-color: #014128;
  }

  .mobile-btns-container{
    display: none;
  }

  @media only screen and (max-width: 991px){
    .main-container{
      flex-direction: column;
      height: 75vh !important;
      overflow-y: scroll;
      align-items: center;
    }

    .container{
      flex-direction: column;
      width: 80vw;
      height: 75vh !important;
      justify-content: center;
      align-items: center;
    }

    .sidebar-container{
      width: 80vw !important;
      height: unset;
      align-items: center;
      justify-content: center;
    }

    .profile-container{
      padding-top: unset;
      height: unset;
      min-height: 35vh;
      justify-content: end;
    }

    .btns-container{
      display: none;
    }

    .info-container{
      width: 80vw;
    }

    .personal-container{
      flex-direction: column;
      height: unset;
      padding-top: 5vh;
    }

    .title-container{
      width: 80vw;
    }

    .info-data-container{
      width: 60vw;
      align-items: end;
    }

    .stat-container .title-container{
      width: 70vw;
    }


    .mobile-btns-container{
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      height: 10vh;
      align-items: center;
    }

    .mobile-btns-container button{
      height: 5vh;
      width: 25vw;
      border: none;
      border-radius: 50px;
      background: #014128;
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
    }

    .mobile-btns-container button:hover{
      background-color: #009056;
    }
  }
</style>
