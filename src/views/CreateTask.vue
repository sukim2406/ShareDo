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
        <div class="mobilecompleted-container" v-if="modify">
            <button @click="CompleteTask">Completed</button>
        </div>
        <div class="form-container">
            <div class="form">
                <div class="form-completed" v-if="modify">
                    <button @click="CompleteTask">Completed</button>
                </div>
                <div class="form-firstline">
                    <div class="input-title">
                        <h5>Title</h5>
                        <input v-if="modify" type="text" class="form-control" id="taskTitle" placeholder="Title" v-model="form.title" disabled>
                        <input v-else type="text" class="form-control" id="taskTitle" placeholder="Title" v-model="form.title" style="background-color: black" required>
                    </div>
                    <div class="input-due">
                        <h5>Due</h5>
                        <input type="date" class="form-control" id="dueDate" v-model="form.due">
                    </div>
                </div>
                <div class="form-secondline">
                    <div class="input-description">
                        <h5>Description</h5>
                        <textarea id="description" cols="15" rows="10" class="form-control" placeholder="What needs to be done?" v-model="form.description"></textarea>
                    </div>
                    <div class="input-contributors">
                        <h5>Contributors</h5>
                        <textarea id="contributors" cols="15" rows="8" class="form-control" v-model="contributorsStr" disabled placeholder="No contributors yet"></textarea>
                        <div class="contributors-element">
                            <input type="text" class="form-control" id="email" v-model="email" placeholder="Email Here">
                            <button @click="AddContributor">Add / Remove</button>
                        </div>
                    </div>
                    <div class="input-subtasks">
                        <h5>Subtasks</h5>
                        <div class="input-subtasks-table">
                            <table v-if="form.subtasks.length === 0">
                                <tbody>
                                    <tr>
                                        <td> No Subtasks assigned</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table v-else>
                                <tbody>
                                    <tr>
                                        <td>subtask 1</td>
                                        <td>completed</td>
                                        <td>1.1.2022</td>
                                    </tr>
                                    <tr>
                                        <td>subtask 1</td>
                                        <td>completed</td>
                                        <td>1.1.2022</td>
                                    </tr>
                                    <tr>
                                        <td>subtask 1</td>
                                        <td>completed</td>
                                        <td>1.1.2022</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="subtasks-element">
                            <button @click="CreateSubtask">Create Subtask</button>
                        </div>
                    </div>
                </div>
                <div class="form-thirdline">
                    <div class="input-creator">
                        <h5>Creator</h5>
                        <input type="text" class="form-control" id="creator" placeholder="Creator" v-model="form.owner" disabled>
                    </div>
                    <div class="input-lastupdated">
                        <h5>Last Updated</h5>
                        <input type="text" class="form-control" id="lastUpdated" v-model="form.lastUpdated" disabled>
                    </div>
                </div>
                <div class="form-comments">
                    <div class="comments">
                        <table v-if="!form.comments">
                            <tbody>
                                <tr>
                                    <td> No Comments Yet</td>
                                </tr>
                            </tbody>
                        </table>
                        <table v-else>
                            <tbody v-for="comment in form.comments" :key="comment">
                                <tr>
                                    <td>{{ comment.user }}</td>
                                    <td>{{ comment.comment }}</td>
                                    <td>{{ comment.time }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="comment">
                        <a href="#">@{{ currentUser }}</a>
                        <input type="text" v-model="commentText">
                        <button @click="PostComment">post</button>
                    </div>
                </div>    
                <div class="form-btns">
                    <button @click="SaveTask">Save</button>
                    <button>
                        <router-link to="/" style="text-decoration: none; background-color:inherit; color:inherit;">Cancel</router-link> 
                    </button>
                </div>           
            </div>
        </div>
        <div class="mobilebtn-container">
            <button @click="SaveTask">Save</button>
            <button>Cancel</button>
        </div>
    </div>
    <div class="footer-container">
        <Footer />
    </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../firebase-auth'
import { createTask, userService, taskService } from '../firebase-store'
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
        const parentTask = ref("")
        const subtask = ref(false)
        const modify = ref(false)
        const router = useRouter()
        const route = useRoute()
        const email = ref('')
        const currentUser = ref('')
        const commentText = ref('')
        const form = reactive({
            id: '',
            title: '',
            due: new Date().toISOString().slice(0,10),
            description: '',
            contributors: [],
            owner: '',
            completed: false,
            lastUpdated: new Date().toISOString().slice(0,16),
            newsfeed: true,
            comments: [],
            subtasks: ["testing"],
        })

        const contributorsStr = ref('')

        onBeforeMount(async () => {
            await authService.authenticated()
                .then(async () => {
                    await userService.getUserByEmail(authService.user.email)
                        .then(() => {
                            currentUser.value = userService.doc.data().name
                        })
                })
            // if(typeof(route.params.id) != 'undefined'){
            //     taskId.value = route.params.id
            // }
            if(route.params.parent == ''){
                console.log("hi?")
                if(typeof(route.params.id) == 'undefined'){
                    modify.value = false
                    form.owner = authService.user.email
                    form.contributors.push(form.owner)
                    contributorsStr.value = (form.contributors.join()).replaceAll(',', '\n')
                    console.log("this")
                }
                else{
                    form.id = route.params.id
                    modify.value = true
                    GetTask(form.id)
                    console.log("that")
                }
            }
            else{
                parentTask.value = route.params.id
                subtask.value = route.params.subtask
                console.log(route.params.subtask, route.params.id)
            }


            console.log("asaaa", contributorsStr.value)
        })

        const GetTask = async (taskId) => {
            await taskService.getTask(taskId)
                .then(() => {
                    form.title = taskService.doc.data().title
                    form.due = taskService.doc.data().due
                    form.contributors = taskService.doc.data().contributors
                    form.description = taskService.doc.data().description
                    form.lastUpdated = taskService.doc.data().lastUpdated
                    form.comments = taskService.doc.data().comments
                    form.owner = taskService.doc.data().owner
                    contributorsStr.value = (form.contributors.join()).replaceAll(',', '\n')
                })
        } 

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
                            contributorsStr.value = (form.contributors.join()).replaceAll(',', '\n')
                        }
                        else if(form.owner == email.value){
                            alert("Owner cannot be removed")
                        }
                        else{
                            form.contributors.push(email.value)
                            contributorsStr.value = (form.contributors.join()).replaceAll(',', '\n')
                        }

                        userService.resetDoc()
                    }
                })
            console.log(form.contributors)
        }

        const PostComment = async () => {
            if(!modify.value){
                alert("Comments can be posted after the task has been created")
            }
            else{
                form.lastUpdated = new Date().toISOString().slice(0,16)
                let commentObj = new reactive({
                    user: currentUser.value,
                    time: form.lastUpdated,
                    comment: commentText.value
                })
                console.log(commentObj)
                form.comments.push(commentObj)

                await taskService.updateTask(form.id, form)
            }
        }

        const SaveTask = async () => {
            form.lastUpdated = new Date().toISOString().slice(0,16)
            if(!modify.value){
                form.comments = [{'user': currentUser.value, 'comment': 'Task Created', 'time': new Date().toISOString().slice(0,16)}]
                await createTask({...form})
                    .then(async (result) => {
                        await userService.getUserName(authService.user.uid)
                        // console.log("user = ", userService.doc.data())
                        let taskObj = new reactive({
                            id: result.id,
                            lastUpdated: '',
                        })
                        userService.updateUser({
                            tasks: firebase.firestore.FieldValue.arrayUnion(taskObj)
                        })
                        form.contributors.forEach(async contributor => {
                            if(contributor != form.owner){
                                await userService.getUserByEmail(contributor)
                                userService.updateUser({
                                    tasks: firebase.firestore.FieldValue.arrayUnion(taskObj)
                                })
                            }
                        })
                        router.replace('/')
                    })
            }
            else{
                await taskService.updateTask(form.id, form)
                .then(() => {
                    form.contributors.forEach(async contributor=> {
                        if(contributor != form.owner){
                            let taskObj = new reactive({
                                id: form.id,
                                lastUpdated: '',
                            })
                            await userService.getUserByEmail(contributor)
                            userService.updateUser({
                                tasks: firebase.firestore.FieldValue.arrayUnion(taskObj)
                            })
                        }
                    })
                    router.replace('/')
                })
            }

        }

        const CompleteTask = async () =>{
            if(confirm("Task Completed? (Cannot be undone)")){
                let completedComment = reactive({
                    'user': currentUser.value,
                    'comment': 'Task Completed',
                    'time': new Date().toISOString().slice(0,16)
                })
                form.comments.push(completedComment)
                form.completed = true
                await taskService.updateTask(form.id, form)
                    .then(() => {
                        router.replace('/')
                    })
            }
            console.log("that")
        }

        const CreateSubtask = () => {
            console.log("hi?")
            router.push({name: 'Create', params: { parent: form.id, id: ''}})
        }

        return {
            form,
            email,
            modify,
            contributorsStr,
            currentUser,
            commentText,
            subtask,
            parentTask,
            GetTask,
            AddContributor,
            SaveTask,
            PostComment,
            CompleteTask,
            CreateSubtask,
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

    h5{
        color:  #014128;
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

    .mobilecompleted-container{
        display: none;
    }

    .form-container {
        height: 75vh;
        width: 80vw;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .form-completed{
        display: flex;
        justify-content: center;
    }
    
    .form-completed button{
        width: 67vw;
        border: none;
        border-radius: 50px;
        background: #014128;
        color: #fff;
        font-weight: 600;
        text-transform: uppercase;
        cursor: pointer;
        justify-content: center;
        align-items: center;
    }

    .form-completed button:hover{
        background: #009056;
    }

    .form-firstline{
        padding-top: 2vh;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .input-title{
        width:30vw;
    }

    .input-title input {
        background-color: #014128;
    }

    .input-due{
        width: 30vw;
    }

    ::-webkit-calendar-picker-indicator {
    filter: invert(1);
    }

    .form-secondline{
        padding-top: 2vh;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .input-description{
        width: 20vw;
    }

    .input-contributors{
        width: 20vw;
    }

    .input-contributors textarea{
        background-color: #014128;
    }

    .contributors-element{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .contributors-element input{
        width: 15vw;
    }

    .contributors-element button{
        width: 5vw;
        border: none;
        color: #009056;
        text-transform: uppercase;
    }

    .contributors-element button:hover{
        background-color: #009056;
        color: white;
    }

    .input-subtasks{
        width: 20vw;
    }

    .input-subtasks-table {
        height: 21vh !important;
        overflow-y: scroll;
        width: 20vw;
    }
    .input-subtasks-table table tbody{
        display: flex;
        flex-direction: column;
    }

    .input-subtasks-table table tbody tr{
        display: flex;
        flex-direction: row;
    }

    .input-subtasks-table table tbody tr:hover {
        cursor: pointer;
    }

    .subtasks-element{
        display: flex;
        flex-direction: row;
        justify-content: end;
    }

    .subtasks-element button{
        width: 10vw;
        border: none;
        color: #009056;
        text-transform: uppercase;
    }

    .subtasks-element button:hover{
        background: #009056;
        color: white;
    }

    .form-thirdline{
        padding-top: 2vh;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .input-creator{
        width: 30vw;
    }

    .input-creator input{
        background-color: #014128;
    }

    .input-lastupdated{
        width: 30vw;
    }

    .input-lastupdated input{
        background-color: #014128;
    }

    .form-comments{
        padding-top: 2vh;
        width: 80vw;
        height: 20vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .comments{
        height: 20vh !important;
        overflow-y: scroll;
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

    .comment a{
        color: #009056;
    }

    .comment input{
        width:30vw;
        margin-left: 3vw;
        margin-right: 1vw;
    }

    .comment button{
        width: 7vw;
        border: none;
        /* border-width: 1px;
        border-color: #014128; */
        color: #009056;
        text-transform: uppercase;
        cursor: pointer;
    }

    .comment button:hover{
        background-color: #009056;
        color: white;
    }

    .form-btns{
        padding-top: 3vh;
        width: 80vw;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .form-btns button{
        width: 20vw;
        border: none;
        border-radius: 50px;
        background: #014128;
        color: #fff;
        font-weight: 600;
        text-transform: uppercase;
        cursor: pointer;
        justify-content: center;
        align-items: center;
    }

    .form-btns button:hover{
        background-color: #009056;
    }

    .mobilebtn-container{
        display: none;
    }

    @media only screen and (max-width: 991px){
        .mobilecompleted-container{
            padding-top: 5vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 80vw;
        }

        .mobilecompleted-container button{
            width: 60vw;
            border: none;
            border-radius: 50px;
            background: #014128;
            color: #fff;
            font-weight: 600;
            text-transform: uppercase;
            cursor: pointer;
            justify-content: center;
            align-items: center;
        }

        .mobilecompleted-container button:hover{
            background: #009056;
        }

        .form-container{
            min-height: 65vh !important;
            overflow-y: scroll;
            overflow-x: hidden;
        }
        .form{
            height: 65vh !important;
        }

        .form-completed{
            display: none;
        }

        .form-firstline{
            padding-top: 3vh;
            flex-direction: column;
            height: unset;
            width: 80vw;
            align-items: center;
        }
        .input-title{
            width: 60vw;
        }
        .input-due{
            padding-top: 3vh;
            width: 60vw;
        }

        .form-secondline{
            padding-top: 3vh;
            flex-direction: column;
            width: 80vw;
            align-items: center;
        }

        .input-description{
            width: 60vw;
        }

        .input-contributors{
            padding-top: 3vh;
            width: 60vw;
        }

        .contributors-element input{
            width: 40vw;
        }

        .contributors-element button{
            width: 15vw;
        }

        .input-subtasks{
            padding-top: 3vh;
            width: 60vw;
        }

        .subtasks-element button{
            width: 20vw;
        }

        .form-thirdline{
            flex-direction: column;
            padding-top: 3vh;
            width: 80vw;
            align-items: center;
        }


        .input-creator{
            width: 60vw;
        }

        .input-lastupdated{
            padding-top: 3vw;
            width: 60vw;
        }

        .form-comments{
            padding-bottom: 1vh;
            width: 80vw;
        }

        .form-btns{
            display: none;
        }

        .mobilebtn-container{
            display: flex;
            flex-direction: row;
            height: 10vh;
            width: 60vw;
            justify-content: space-evenly;
            align-items: center;
        }

        .mobilebtn-container button{
            width: 15vw;
            height: 5vh;
            border: none;
            border-radius: 50px;
            background: #014128;
            color: #fff;
            font-weight: 600;
            text-transform: uppercase;
            cursor: pointer;
            justify-content: center;
            align-items: center;
        }

        .mobilebtn-container button:hover{
            background-color: #009056;
        }
    }
</style>