<template>
    <div class="header-container">
        <Header />
    </div>
    <div class="main-container">
        <div class="title-container" v-if="modify">
            <h1>Task Detail</h1>
            <h4>Date: {{ timestamp }}</h4>
        </div>
        <div class="title-container" v-else>
            <h1>Create a New Task</h1>
            <h4>Date: {{ timestamp }}</h4>
        </div>
        <div class="form-container">
            <form>
                <div class="form-firstline">
                    <div class="input-title">
                        <h5>Title</h5>
                        <input type="text" class="form-control" id="taskTitle" placeholder="Title">
                    </div>
                    <div class="input-due">
                        <h5>Due</h5>
                        <input type="date" class="form-control" id="dueDate">
                    </div>
                </div>
                <div class="form-secondline">
                    <div class="input-description">
                        <h5>Description</h5>
                        <textarea id="description" cols="15" rows="10" class="form-control" placeholder="What needs to be done?"></textarea>
                    </div>
                    <div class="input-contributors">
                        <h5>Contributors</h5>
                        <textarea id="contributors" cols="15" rows="9" class="form-control"></textarea>
                        <div class="contributors-element">
                            <input type="text" class="form-control" id="email">
                            <button>Add</button>
                        </div>
                    </div>
                </div>
                <div class="form-thirdline">
                    <div class="input-creator">
                        <h5>Creator</h5>
                        <input type="text" class="form-control" id="creator" placeholder="Title">
                    </div>
                    <div class="input-lastupdated">
                        <h5>Last Updated</h5>
                        <input type="date" class="form-control" id="lastUpdated">
                    </div>
                </div>
                <div class="form-comments">
                    <div class="comments">
                        <table>
                            <tbody>
                                <tr>
                                    <td> tempuser1</td>
                                    <td> tempcomment1</td>
                                    <td> temptime1</td>
                                </tr>
                                <tr>
                                    <td> tempuser2</td>
                                    <td> tempcomment2</td>
                                    <td> temptime2</td>
                                </tr>
                                <tr>
                                    <td> tempuser3</td>
                                    <td> tempcomment3</td>
                                    <td> temptime3</td>
                                </tr>
                                <tr>
                                    <td> tempuser4</td>
                                    <td> tempcomment4</td>
                                    <td> temptime4</td>
                                </tr>
                                <tr>
                                    <td> tempuser5</td>
                                    <td> tempcomment5</td>
                                    <td> temptime5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="comment">
                        <a href="#">@Username</a>
                        <input type="text">
                        <button>post</button>
                    </div>
                </div>    
                <div class="form-btns">
                    <button>Save</button>
                    <button>Cancel</button>
                </div>            
            </form>
        </div>
    </div>
    <!-- <div class="container">
        <div class="d-sm-flex">
            <div>
                <h2>
                    Create a New Task
                </h2>
                <form @submit.prevent="CreateTask">
                    <div class="row g-3">
                        <div class="col-12">
                            <input type="text" class="form-control" id="taskTitle" placeholder="Title" v-model="form.title" required>
                        </div>
                        <div class="col-12">
                            <input type="date" class="form-control" id="dueDate" v-model="form.due" required>
                        </div>
                        <div class="col-12">
                            <textarea id="description" cols="30" rows="10" class="form-control" placeholder="What needs to be done?" v-model="form.description"></textarea>
                        </div>
                        <div class="col-12">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="Add contributors" aria-label="Add contributors" aria-describedby="basic-addon2" v-model="email">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type=button @click="AddContributor">Add / Remove</button>
                                </div>
                            </div>
                            <select class="col-12 custom-select" multiple>
                                <option :key="i" v-for="(contributor, i) in form.contributors">{{ contributor }}</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-success mt-3">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div> -->
    <div class="footer-container">
        <Footer />
    </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../firebase-auth'
import { createTask, userService } from '../firebase-store'
import firebase from 'firebase'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default {
    components: {
        Header,
        Footer,
    },

  data: () => ({
    timestamp: ''
  }),

  created() {
    setInterval(this.getNow, 1000)
  },

  methods:{
    getNow: function(){
      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
      const dateTime = date + ' ' + time;
      this.timestamp = dateTime
    }
  },

    setup(){
        const modify = ref(false)
        const taskId = ref('')
        const router = useRouter()
        const route = useRoute()
        const email = ref('')
        const form = reactive({
            title: '',
            due: new Date().toISOString().slice(0,10),
            description: '',
            contributors: [],
            owner: '',
            completed: false,
            lastUpdated: new Date().toISOString().slice(0,16),
            newsfeed: true,
        })

        onBeforeMount(async () => {
            await authService.authenticated()
            form.owner = authService.user.email
            form.contributors.push(form.owner)
            // if(typeof(route.params.id) != 'undefined'){
            //     taskId.value = route.params.id
            // }
            if(typeof(route.params.id) == 'undefined'){
                taskId.value = ''
                modify.value = false
            }
            else{
                taskId.value = route.params.id
                modify.value = true
            }
        })

        const AddContributor = async () => {
            let duplicate = false

            await userService.getUserByEmail(email.value)
                .then(() =>{
                    if(userService.doc== null){
                        alert("User not found, check email")
                    }
                    else{            
                        form.contributors.forEach((element) =>{
                            if(form.owner != element && element == email.value){
                                duplicate = true
                            }
                        })
                        if(duplicate){
                            form.contributors.pop(email.value)
                        }
                        else if(form.owner == email.value){
                            alert("Owner cannot be removed")
                        }
                        else{
                            form.contributors.push(email.value)
                        }

                        userService.resetDoc()
                    }
                })
            console.log(form.contributors)
        }

        const CreateTask = async () => {
            await createTask({...form})
                .then(async (result) => {
                    await userService.getUserName(authService.user.uid)
                    // console.log("user = ", userService.doc.data())
                    userService.updateUser({
                        tasks: firebase.firestore.FieldValue.arrayUnion(result.id)
                    })
                    form.contributors.forEach(async contributor => {
                        if(contributor != form.owner){
                            await userService.getUserByEmail(contributor)
                            userService.updateUser({
                                tasks: firebase.firestore.FieldValue.arrayUnion(result.id)
                            })
                        }
                    })
                    router.replace('/')
                })
        }

        return {
            form,
            email,
            taskId,
            modify,
            AddContributor,
            CreateTask,
        }
    }
}
</script>

<style scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
        background-color: black;
        color: white;
    }

    .main-container{
        display: flex;
        flex-direction: column;
        height: 85vh;
        justify-content: center;
        align-items: center;
    }

    .title-container{
        width: 80vw;
        height: 10vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .title-container h1{
        font-weight: 600;
    }

    .title-container h4{
        text-align: right;
    }

    .form-container {
        height: 75vh;
        width: 80vw;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .form-firstline{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .input-title{
        width:30vw;
    }

    .input-due{
        width: 30vw;
    }

    .form-secondline{
        padding-top: 3vh;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .input-description{
        width: 30vw;
    }

    .input-contributors{
        width: 30vw;
    }

    .contributors-element{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .contributors-element input{
        width: 20vw;
    }

    .contributors-element button{
        width: 5vw;
    }

    .form-thirdline{
        padding-top: 3vh;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .input-creator{
        width: 30vw;
    }

    .input-lastupdated{
        width: 30vw;
    }

    .form-comments{
        padding-top: 3vh;
        width: 80vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .form-comments table{
        width: 60vw;
        text-align: center;
    }

    .comment {
        padding-top: 1vh;
        width: 60vw;
        display: flex;
        flex-direction: row;
        justify-content:end;
    }

    .comment input{
        width:30vw;
    }

    .form-btns{
        padding-top: 3vh;
        width: 80vw;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    @media only screen and (max-width: 991px){
        .form-container{
            min-height: 75vh !important;
            overflow-y: scroll;
        }
        .form-firstline{
            flex-direction: column;
            height: unset;
        }

        .form-secondline{
            flex-direction: column;
            height: unset;
        }

        .form-thirdline{
            flex-direction: column;
        }
    }
</style>