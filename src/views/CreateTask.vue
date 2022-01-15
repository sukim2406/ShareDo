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
            <div class="mobilecompleted-container-bar" v-if="openSubtask">
                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" :style= "progressStyle" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{ progressPercent }}%</div>
                <p>You must finish all of subtasks first before you can finish this task</p>                
            </div>
            <div class="mobilecompleted-container-btn" v-else>
                <button @click="CompleteTask" v-if="previleged">Completed</button>
                <button v-else disabled style="background: grey"> only contriburos can complete the task</button>
            </div>
        </div>
        <div class="form-container">
            <div class="form">
                <div class="form-completed" v-if="modify">
                    <div class="form-completed-bar" v-if="openSubtask">
                        <div class="progress-bar progress-bar-striped bg-success" role="progressbar" :style= "progressStyle" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{ progressPercent }}%</div>
                        <p>You must finish all of subtasks first before you can finish this task</p>
                    </div>
                    <div class="form-completed-btn" v-else>
                        <button @click="CompleteTask" v-if="previleged">Completed</button>
                        <button v-else disabled style="background: grey"> only contributors can complete the task </button>
                    </div>
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
                                <tbody v-for="task in subTasks" :key="task.id">
                                    <tr v-if="task.completed">
                                        <td> {{ task.title }}</td>
                                        <td> completed</td>
                                    </tr>
                                    <tr v-else @click="ShowTask(task)">
                                        <td> {{ task.title }}</td>
                                        <td> {{ task.due }}</td>
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
                    <button @click="SaveTask" v-if="previleged">Save</button>
                    <button v-else style="background: grey" disabled>Not a contributor</button>
                    <button>
                        <router-link to="/" style="text-decoration: none; background-color:inherit; color:inherit;">Cancel</router-link> 
                    </button>
                </div>           
            </div>
        </div>
        <div class="mobilebtn-container">
            <button @click="SaveTask" v-if="previleged">Save</button>
            <button v-else style="background: grey" disabled>Not a contributor</button>
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
        const previleged = ref(true)
        const parentDue = ref("")
        const subtaskTotal = ref(0)
        const subtaskOpen = ref(0)
        const progressPercent = ref(0)
        const progressStyle = ref("")
        const openSubtask = ref(false)
        const subTasks = ref([])
        const parentTask = ref("")
        const parentSubtask = ref([])
        const modify = ref(false)
        const router = useRouter()
        const route = useRoute()
        const email = ref('')
        const currentUser = ref('')
        const commentText = ref('')
        const form = reactive({
            id: '',
            title: '',
            // due: new Date().toISOString().slice(0,10),
            due: new Date().toString().slice(0,24),
            description: '',
            contributors: [],
            owner: '',
            completed: false,
            // lastUpdated: new Date().toISOString().slice(0,16),
            lastUpdated: new Date().toString().slice(0,24),
            newsfeed: true,
            comments: [],
            subtasks: [],
        })

        const contributorsStr = ref('')

        onBeforeMount(async () => {
            console.log("temp", previleged.value)
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
            if(typeof(route.params.id) == 'undefined'){
                modify.value = false
                form.owner = authService.user.email
                form.contributors.push(form.owner)
                contributorsStr.value = (form.contributors.join()).replaceAll(',', '\n')
                console.log("this", previleged.value)
            }
            else{
                form.id = route.params.id
                modify.value = true
                GetTask(form.id)
                    .then(async () => {
                        progressPercent.value = Math.round(((subtaskTotal.value-subtaskOpen.value) / subtaskTotal.value) * 100)
                        ProgressFunction(progressPercent.value)
                        console.log(progressPercent.value, subtaskTotal.value, subtaskOpen.value)
                    })
                console.log("that")

            }

        })

        const GetTask = async (taskId) => {
            console.log('comes here')
            CheckPrevilege()
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
                    form.subtasks = taskService.doc.data().subtasks
                    subtaskTotal.value = form.subtasks.length
                    form.subtasks.forEach(async task => {
                        await taskService.getTask(task)
                        .then(async () =>{
                            await subTasks.value.push(taskService.doc.data())
                            if(taskService.doc.data().completed == false){
                                openSubtask.value= true
                                subtaskOpen.value += 1
                                console.log("here", subtaskOpen.value)
                                
                            }
                        })
                        .then(async () =>{
                            progressPercent.value = Math.round(((subtaskTotal.value-subtaskOpen.value) / subtaskTotal.value) * 100)
                            ProgressFunction(progressPercent.value)
                            console.log(progressPercent.value, subtaskTotal.value, subtaskOpen.value)
                        })
                    })
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
                // form.lastUpdated = new Date().toISOString().slice(0,16)
                form.lastUpdated = new Date().toString().slice(0,24)
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
            // form.lastUpdated = new Date().toISOString().slice(0,16)
            form.lastUpdated = new Date().toString().slice(0,24)
            if(!modify.value){
                if(parentDue.value != ''){
                    if(!(parentDue.value >= form.due)){
                        if(confirm("Subtask's due date cannot be later then Parent Task's due. Do you want to set it as same as parent task's due?")){
                            form.due = parentDue.value
                        }
                        else{
                            return
                        }
                    }
                    console.log("Due Check", parentDue.value, form.due, parentDue.value >= form.due)
                }
                form.comments = [{'user': currentUser.value, 'comment': 'Task Created', 'time': new Date().toString().slice(0,24)}]
                await createTask({...form})
                    .then(async (result) => {
                        await taskService.updateTask(result.id, {'id': result.id})
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
                        if(parentTask.value){
                            console.log("taskId = ", result.id)
                            parentSubtask.value.push(result.id)
                            console.log("debug", parentSubtask.value)
                            await taskService.getTask(parentTask.value)
                                .then(() => {
                                    taskService.updateTask(parentTask.value,{subtasks: parentSubtask.value})
                                })
                        }
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
                    // 'time': new Date().toISOString().slice(0,16)
                    'time': new Date().toString().slice(0,24)
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
            if(modify.value){
                parentTask.value = form.id
                parentSubtask.value =form.subtasks
                parentDue.value = form.due
                modify.value = false
                form.id = ''
                form.title = ''
                // form.due = new Date().toISOString().slice(0,10)
                form.due = new Date().toString().slice(0,24)
                form.description = ''
                form.completed = false
                // form.lastUpdated = new Date().toISOString().slice(0,16)
                form.lastUpdated = new Date().toString().slice(0,24)
                form.newsfeed = true
                form.comments = []
                form.subtasks = []
                form.contributors = []
                form.owner = authService.user.email
                form.contributors.push(form.owner)
                contributorsStr.value = (form.contributors.join()).replaceAll(',', '\n')
            }
            console.log(parentTask.value)
        }

        const ShowTask = async (task) => {
            CheckPrevilege()
            console.log("alskdjalksdj", task)
            await taskService.getTask(task.id)
                console.log(taskService.doc.data())
                form.title = taskService.doc.data().title
                form.due = taskService.doc.data().due
                form.description = taskService.doc.data().description
                form.contributors = taskService.doc.data().contributors
                contributorsStr.value = (form.contributors.join()).replaceAll(',', '\n')
                form.owner = taskService.doc.data().owner
                form.lastUpdated = taskService.doc.data().lastUpdated
                form.completed = taskService.doc.data().completed
                form.id = task.id
                form.comments = taskService.doc.data().comments
                form.subtasks = taskService.doc.data().subtasks
                subTasks.value = []
                form.subtasks.forEach(async task => {
                    await taskService.getTask(task)
                    .then(async () =>{
                        await subTasks.value.push(taskService.doc.data())
                        if(taskService.doc.data().completed == false){
                            openSubtask.value= true
                            subtaskOpen.value += 1
                            console.log("here", subtaskOpen.value)
                            
                        }
                    })
                    .then(async () =>{
                        progressPercent.value = Math.round(((subtaskTotal.value-subtaskOpen.value) / subtaskTotal.value) * 100)
                        ProgressFunction(progressPercent.value)
                        console.log(progressPercent.value, subtaskTotal.value, subtaskOpen.value)
                    })
                })
                openSubtask.value = false
        }

        const ProgressFunction = (percent) => {
            progressStyle.value = "width: " + percent + "% ;"
        }

        const CheckPrevilege = () =>{
            let checksum = false;
            console.log('contributors =', form.contributors)
            form.contributors.forEach(contributor =>{
                console.log('contributor =', contributor)
                if(contributor == authService.user.email){
                    checksum = true
                }
            })

            console.log('checksum = ', checksum)

            if(checksum){
              previleged.value = true  
            }
            else{
                previleged.value = false
            }
        }

        return {
            form,
            email,
            modify,
            contributorsStr,
            currentUser,
            commentText,
            parentTask,
            subTasks,
            openSubtask,
            subtaskTotal,
            subtaskOpen,
            progressPercent,
            progressStyle,
            parentDue,
            previleged,
            GetTask,
            AddContributor,
            SaveTask,
            PostComment,
            CompleteTask,
            CreateSubtask,
            ShowTask,
            ProgressFunction,
            CheckPrevilege,
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
        height: 5vh;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
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
        height: 80vh;
        width: 80vw;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .form-completed{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .form-completed-bar{
        width: 67vw;
        background-color: white;
    }
    
    .form-completed-btn button{
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

    .input-subtasks-table table{
        width: 100%;
    }
    .input-subtasks-table table tbody{
        display: flex;
        flex-direction: column;
    }

    .input-subtasks-table table tbody tr{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .input-subtasks-table table tbody tr:hover {
        cursor: pointer;
        background: #014128;
    }

    .input-subtasks-table table tbody tr td{
        background: inherit;
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

        .input-subtasks-table{
            width: 60vw;
        }

        .input-subtasks-table table{
            width: 100%;
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