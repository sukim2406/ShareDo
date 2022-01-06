<template>
  <head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  </head>
  <div class="header-container">
    <Header />
  </div>
  <div class="main-container">
    <div class="greeting-container">
      <h1>Welcome (Back), {{currentUserName}}</h1>
      <h4>current time is {{ timestamp }} </h4>
    </div>
    <div class="progress-container">
      <div class="progress">
        <div class="progress-bar progress-bar-striped bg-success" role="progressbar" :style = "progressStyle" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{ progressPercent}}%</div>
      </div>
      <p v-if="progressPercent != 100">You have completed {{ tasksCompleted.length }} tasks out of {{ tasks.length + tasksCompleted.length }} tasks</p>
      <p v-else>Great! You have completed all the tasks! Perhaps start a new one?</p>
    </div>
    <div class="body-container">
      <div class="cards-container">
        <div class="cards-cards" v-if="newsfeedTasks.length != 0">
          <div class="card" v-for="task in newsfeedTasks" :key="task">
            <div class="card-body">
              <h5 class="card-title">{{ task.title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted"> Last updated at</h6>
              <h6 class="card-subtitle mb-2 text-muted"> {{ task.lastUpdated }}</h6>
              <p class="card-text"> Due : {{ task.due }}</p>
              <div class="card-a">
                <button @click="ShowTask(task)">View</button>
                <button @click="BtnMarkAsRead(task)">Mark as Read</button>
              </div>
            </div>
          </div>
        </div>
        <div class="cards-cards" v-else>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">No new updates</h5>
              <p>No new updates at this time</p>
            </div>
          </div>
        </div>
      </div>
      <div class="table-container">
        <div class="table-tabs">
          <ul class="nav nav-tabs nav-fill">
            <li class= "nav-item" :key="i" v-for="(column, i) in columns">
              <a href="#" class="nav-link" :class="{ active: IsActive(column) }" aria-current="page" v-on:click = "SortBy(column)">
                  {{ column }}
              </a>
            </li>
          </ul>
        </div>
        <div class="table-table">
          <table class="table" v-if="sortKey != 'Completed'">
            <thead class="thead">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Due Date</th>
                <th scope="col">Last Updated</th>
              </tr>
            </thead>
            <tbody v-for="task in tasks" :key="task.id">
              <tr @click="ShowTask(task)">
                <td>{{ task.title }}</td>
                <td>{{ task. due }}</td>
                <td>{{ task.lastUpdated }} </td>
              </tr>
            </tbody>
          </table>
          <table class="table" v-else>
            <thead class="thead">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Due Date</th>
                <th scope="col">Completed</th>
              </tr>
            </thead>
            <tbody v-for="task in tasksCompleted" :key="task.id">
              <tr @click="ShowTask(task)">
                <td>{{ task.title }}</td>
                <td>{{ task. due }}</td>
                <td>{{ task.lastUpdated }} </td>
              </tr>
            </tbody>
          </table>
        </div>      
      </div>      
    </div>
    <div class="create-container">
      <button class="btn">
        <router-link to="/create" class="nav-link">Create New Task</router-link>
      </button>
    </div>
  </div>
  <div class="footer-container">
    <Footer />
  </div>
  <!-- <div class="body-container">
    <div class="container" :class="mode">
      <div class="tasks-carousel">
        <div class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <p>test1</p>
            </div>
            <div class="carousel-item">
              <p>test2</p>
            </div>
            <div class="carousel-item">
              <p>test3</p>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="tasks-task">
        <div class="tasks">
          <ul class="nav nav-tabs nav-fill">
            <li class= "nav-item" :key="i" v-for="(column, i) in columns">
              <a href="#" class="nav-link" :class="{ active: IsActive(column) }" aria-current="page" v-on:click = "SortBy(column)">
                {{ column }}
              </a>
            </li>
          </ul>
          <div class="tasks-table">
            <div class="table-content">
              <table class="table" v-if="sortKey != 'Completed'">
                <thead class="thead">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Last Updated</th>
                  </tr>
                </thead>
                <tbody v-for="task in tasks" :key="task.id">
                  <tr @click="ShowTask(task)">
                    <td>{{ task.title }}</td>
                    <td>{{ task. due }}</td>
                    <td>{{ task.lastUpdated }} </td>
                  </tr>
                </tbody>
              </table>
              <table class="table" v-else>
                <thead class="thead">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Completed</th>
                  </tr>
                </thead>
                <tbody v-for="task in tasksCompleted" :key="task.id">
                  <tr @click="ShowTask(task)">
                    <td>{{ task.title }}</td>
                    <td>{{ task. due }}</td>
                    <td>{{ task.lastUpdated }} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <form @submit.prevent="ReloadPage" class="task-form" :key="componentKey">
          <div class="task-title">
            <h2 class="title"> {{ form.title }} </h2>
          </div>
          <div class="task-due-owner">
            <div class="task-due">
              <h5 class="title">Due Date</h5>
              <div class="input-field">
                <input type="date" placeholder="Due" v-model="form.due">
              </div>
            </div>
            <div class="task-owner">
              <h5 class="title">Owner</h5>
              <div class="input-field">
                <input type="text" v-model="form.owner">
              </div>
            </div>
          </div>
          <div class="task-discription">
            <h5 class="title">Discription</h5>
            <div class="input-field">
              <textarea name="" id="description" cols="50" rows="5" v-model="form.description"></textarea>
            </div>
          </div>
          <div class="task-contributors">
            <h5 class="title">Contributors</h5>
            <div class="input-field">
              <textarea name="" id="contributors" cols="50" rows="5" v-model="form.contributors">
              </textarea>
            </div>
          </div>
          <div class="task-comments">
            <div class="comments">
              <table class="table">
                <tbody v-for="comment in form.comments" :key="comment">
                  <tr>
                    <td>{{ comment.user }}</td>
                    <td>{{ comment.comment }}</td>
                    <td>{{ comment.time }} </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="comment">
              <a href="#" class="username">{{currentUserName}}</a>
              <input type="text" v-model="commentText">
              <button class="btn-comment" @click="BtnComment">comment</button>
            </div>
          </div>



          <div class="btns">
            <input type="submit" value="Modify" class="btn">
            <button class="btn" @click="BtnComplete">Completed</button>
          </div>
        </form>
      </div>
      <div class="panels-container">
        <div class="panel left-panel">
          <div class="content">
            <h3>View My Tasks</h3>
            <p>a;skfj;asldjfklksdjc;laksjdc</p>
            <button class="btn" id="task-list-btn" @click="TaskListMode">See my Tasks</button>
          </div>
        </div>
        <div class="panel right-panel">
          <div class="content">
            <h3>Modify / Complete Task</h3>
            <p>You can modify or mark as completed a task by clicking one from the list</p>
            <p> ----------- or ----------- </p>
            <button class="btn" id="task-modify-btn">
              <router-link to="/create" class="nav-link" style="text-decoration: none; color: inherit;">Create New Task</router-link>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../firebase-auth'
import { taskService, userService } from '../firebase-store'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Header,
    Footer,
  },

  data: () => ({
    timestamp: '',
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
    },
    forceRerender() {
      this.reloadKey += 1
    }
  },

  setup(){
    const reloadKey =ref(0)
    const router = useRouter()
    const commentText = ref("")
    const componentKey = ref(false)
    const active = "active"
    const currentUserName = ref("")
    const taskIds = ref([])
    const tasks = ref([])
    const newsfeedTasks = ref([])
    const tasksCompleted = ref([])
    const clickedTask = ref("")
    const mode = ref("")
    const form = reactive({
      title: '',
      due: '',
      description: '',
      contributors: [],
      owner: '',
      completed: false,
      updated: '',
      id: '',
      comments: [],
    })
    const columns = ['Last Updated', 'Title', 'Due Date', 'Completed']
    const sortKey = ref("Last Updated")
    const reverse = ref(false)
    const progressPercent = ref()
    const progressStyle = ref("")

    onBeforeMount(async () => {
      await authService.authenticated()
        .then(async () => {
          await userService.getUserName(authService.user.uid)
          LoadTasks()
          // taskIds.value = userService.doc.data().tasks
          // taskIds.value.forEach(async id => {
          //   await taskService.getTask(id)
          //   if(taskService.doc.data().completed == false){
          //     tasks.value.push({...taskService.doc.data(), id: id})
          //   }
          //   else{
          //     tasksCompleted.value.push({...taskService.doc.data(), id: id})
          //   }
          //   // tasks.value.sort((a,b) => new Date(a.lastUpdated) - new Date(b.lastUpdated))
          //   tasks.value.sort((a,b) => b.title - a.title)
          //   tasksCompleted.value.sort((a,b) => new Date(a.lastUpdated) - new Date(b.lastUpdated))
          // })
          currentUserName.value = userService.doc.data().name
        })
    })

    const LoadTasks = () => {
      taskIds.value = userService.doc.data().tasks
      console.log(taskIds.value)
      taskIds.value.forEach(async task => {
        await taskService.getTask(task.id)
        if(taskService.doc.data().completed == false){
          tasks.value.push({...taskService.doc.data(), id: task.id})
          if(task.lastUpdated != taskService.doc.data().lastUpdated){
            newsfeedTasks.value.push({...taskService.doc.data(), id: task.id})
          }
          // if(taskService.doc.data().newsfeed){
          //   newsfeedTasks.value.push({...taskService.doc.data(), id: id.id})
          // }
        }
        else{
          tasksCompleted.value.push({...taskService.doc.data(), id: task.id})
        }
        tasks.value.sort((a,b) => b.title - a.title)
        tasksCompleted.value.sort((a,b) => new Date(a.lastUpdated) - new Date(b.lastUpdated))
        newsfeedTasks.value.sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        progressPercent.value = Math.round((tasksCompleted.value.length / (tasks.value.length + tasksCompleted.value.length)) * 100)
        ProgressFunction(progressPercent.value)
      })
    }

    const Logout = () => {
      authService.logout()
    }

    const Testing = (task) => {
      console.log(task)
    }

    const ShowTask = async (task) => {
      if(!task.completed){
        await taskService.getTask(task.id)
        form.title = taskService.doc.data().title
        form.due = taskService.doc.data().due
        form.description = taskService.doc.data().description
        form.contributors = taskService.doc.data().contributors
        form.owner = taskService.doc.data().owner
        form.updated = taskService.doc.data().lastUpdated
        form.completed = taskService.doc.data().completed
        form.id = task.id
        form.comments = taskService.doc.data().comments
        
        // TaskModifyMode()
        console.log(form)
        router.push({ name: 'Create', params: { id: task.id}})
      }
      else{
        console.log("completed task")
      }
    }

    const TaskListMode = () => {
      mode.value = ""
    }

    const TaskModifyMode = () => {
      mode.value = "modify-mode"
    }

    const SortByLast = () => {
      if(reverse.value){
        tasks.value.sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      }
      else{
        tasks.value.sort((a,b) => new Date(a.lastUpdated) - new Date(b.lastUpdated))
      }
    }

    const SortByDue = () => {
      if(reverse.value){
        tasks.value.sort((a,b) => new Date(b.due) - new Date(a.due))
      }
      else{
        tasks.value.sort((a,b) => new Date(a.due) - new Date(b.due))
      }
    }

    const SortByTitle = () => {
      function compare(a, b){
        if(reverse.value){
          if (a.title < b.title){
            return 1
          }
          if (a.title > b.title){
            return -1
          }
          return 0
        }
        else {
          if (a.title > b.title){
            return 1
          }
          if (a.title < b.title){
            return -1
          }
          return 0
        }
      }
      tasks.value.sort(compare)
    }

    const SortBy = (key) => {
      reverse.value = (sortKey.value == key) ? ! reverse.value : false;
      sortKey.value = key
      if(sortKey.value == "Last Updated"){
        SortByLast()
      }
      else if(sortKey.value == "Title"){
        SortByTitle()
      }
      else if(sortKey.value == "Due Date"){
        SortByDue()
      }
    }

    const IsActive = (column) => {
      if(sortKey.value == column){
        return true
      }
      else{
        return false
      }
    }

    const BtnComplete = async () => {
      form.completed = true
      form.lastUpdated = new Date().toISOString().slice(0,16)
      await taskService.updateTask(form.id, form)
        .then(() => {
          componentKey.value = !componentKey.value
          LoadTasks()
          ReloadPage()
        })
    }

    const ReloadPage = () => {
      console.log("hi")
    }

    const BtnComment = async () => {
      alert(commentText.value)
      form.lastUpdated = new Date().toISOString().slice(0,16)
      let commentObj = new reactive({
        user: currentUserName.value,
        time: form.lastUpdated,
        comment: commentText.value
      })
      form.comments.push(commentObj)

      await taskService.updateTask(form.id, form)
    }

    const ProgressFunction = (percent) => {
      progressStyle.value = "width: " + percent + "% ;"
    }

    const BtnMarkAsRead = async (task) => {
      let tempTasks = userService.doc.data().tasks
      tempTasks.forEach(tempTask => {
        if(tempTask.id == task.id){
          tempTask.lastUpdated = task.lastUpdated
        }
      })
      await userService.updateUser({
        tasks: tempTasks
      })

      console.log('testing' , tempTasks)

      taskIds.value.splice(0)
      tasks.value.splice(0)
      newsfeedTasks.value.splice(0)

      await userService.getUserName(authService.user.uid)
        .then(() => {
          LoadTasks()
        })
      // taskIds.value.forEach(async task => {
      //   await taskService.getTask(task.id)
      //   if(taskService.doc.data().completed == false){
      //     if(task.lastUpdated != taskService.doc.data().lastUpdated){
      //       newsfeedTasks.value.push({...taskService.doc.data(), id: task.id})
      //     }
      //   }
      // })
      
      // newsfeedTasks.value.sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))


      
    }

    const ForceReload = () => {
      reloadKey.value += 1
      console.log("hello?" , reloadKey.value)
    }

    return {
      reloadKey,
      currentUserName,
      taskIds,
      tasks,
      tasksCompleted,
      newsfeedTasks,
      mode,
      clickedTask,
      form,
      columns,
      sortKey,
      reverse,
      active,
      componentKey,
      commentText,
      progressPercent,
      progressStyle,
      Logout,
      ShowTask,
      TaskListMode,
      TaskModifyMode,
      SortByLast,
      SortByDue,
      SortByTitle,
      SortBy,
      IsActive,
      Testing,
      BtnComplete,
      LoadTasks,
      ReloadPage,
      BtnComment,
      ProgressFunction,
      BtnMarkAsRead,
      ForceReload,
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

  .main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .greeting-container {
    height: 10vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .greeting-container h1{
    font-weight: 600;
  }

  .greeting-container h4{
    text-align: right;
  }

  .progress-container {
    height: 10vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .progress-container p{
    text-align: center;
  }

  .progress {
    width: 80vw;
    height: 25px;
  }

  .body-container {
    display: flex;
    flex-direction: row;
  }

  .cards-container {
    width: 25vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 55vh !important;
    overflow-y: scroll;
    justify-content: center;
  }

  .cards-cards {
    display: flex;
    flex-direction: column;
    height: 55vh;
  }

  .card {
    background-color: #014128;
    height: 11rem;
    width: 16rem;
    margin-bottom: 30px;
  }

  .card-body {
    background-color: inherit;
  }

  .card-body .card-a button{
    border:none;
    background-color: inherit;
    color: #009056;
  }

  .card-body .card-a button:hover{
    color: white;
  }

  .card-body p {
    background: inherit;
    margin-bottom: .5rem;
  }

  .card-title, .card-subtitle, .card-text {
    background-color: inherit;
  }

  .card-a {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: inherit;
  }

  .card-a a{
    background-color: inherit;
  }

  .table-container {
    width: 55vw;
    align-items: center;
  }

  .table-tabs {
    height: 5vh;
    margin-left: 30px;
  }

  .table-tabs a{
    text-decoration: none;
    color: inherit;
  }

  .table-tabs a.active{
    background-color: #014128;
    color: white;
  }

  .table-table {
    height: 50vh !important;
    overflow-y: scroll;
    margin-left: 30px;
  }

  .table-table table th{
    color: grey
  }

  .table-table table tbody tr:hover {
    background-color: #014128;
    cursor: pointer;
  }

  .create-container{
    width: 80vw;
    height: 10vh;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .btn{
    width: 80vw;
    height: 5vh;
    border: none;
    border-radius: 50px;
    background: #014128;
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button.btn a{
    background-color: transparent;
    text-decoration: none;
    color: inherit;
  }

  @media only screen and (max-width: 991px){

    .body-container{
      display: flex;
      flex-direction: column;
      height: 55vh;
      width: 80vw;
    }
    .progress-container{
      justify-content: end;
    }

    .cards-container{
      width: 80vw !important;
      height: 20vh;
      overflow-x: scroll;
      overflow-y: unset;
    }

    .cards-cards{
      display: flex;
      flex-direction: row;
      max-width: 80vw;
      height: 20vh;
    }

    .card{
      margin-bottom: 0;
      margin-right: 10px;
      min-width: 16rem;
      max-height: 11rem !important;
    }

    .table-container{
      width: 80vw;
      height: 35vh;
    }

    .table-tabs{
      margin-left: 0;
    }

    .table-table{
      margin-left: 0;
      height: 25vh !important;
      overflow-y: scroll;
    }
  }
  /* -------------------------------------------- */
  /* .body-container{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 95vh;
    background: #000;
  } */
  
  .container{
    position: relative;
    width: 100vw;
    height: 90vh;
    background: #000;
    border-radius: 10px;
    box-shadow: 0 4px 20px 0 rgba(0,0,0,0.3), 0, 6px 20px 0 rgba(0,0,0,0.3);
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

  .tasks-task{
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

  .tasks{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 40%;
    min-height: 238px;
    padding: 0 10px;
    opacity: 1;
    transition: 0.5s ease-in-out;
    transition-delay: 1s;
  }

  .tasks ul li a{
    color: white;
    text-decoration: none;
  }

  .tasks ul {
    min-width: 100%;
  }

  .tasks-table{
    min-width: 100%;
  }

  .tasks-table th{
    color: #fff;
  }

  .tasks-table tbody tr:hover{
    background: #014128;
  }

  .tasks-table td{
    color: #fff;
  }

  form.task-form{
    opacity: 0;
    transition: 0.5s ease-in-out;
    transition-delay: 1s;
  }

  .task-due-owner{
    display: flex;
    justify-content: space-between;
  }

  .comments{
    height: 100px !important;
    overflow: scroll;
  }

  .comment{
    display: flex;
    padding: 10px;
    margin-bottom: 10px;
    align-items: center;
    color: #333;
    background-color: #f2f2f2;
    border-radius: 30px;
    box-shadow: 1px 1px 3px rgba(0,0,0, 0.2);
    justify-content: space-between;
  }

  .input-field{
    width: 100%;
    margin: 10px 0;
    border: 2px solid #009056;
    border-radius: 50px;
    display: flex;
    align-items: center;
  }

  .input-field input, textarea {
    flex: 5;
    background: none;
    border: none;
    outline: none;
    width: 100%;
    font-size: 15px;
    font-weight: 600;
    color: #444;
    text-align: center;
  }

  .title{
    color: #009056
  }

  .btns{
    display: flex;
    justify-content: space-between;
  }



  /* .btn{
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
  } */

  .btn-comment{
    width: 100px;
    height: 30px;
    border: none;
    border-radius: 25px;
    background: #014128;
    color: #fff;
    font-weight: 200;
    margin: 10px 0;
    text-transform: uppercase;
    cursor: pointer;
  }

  .btn:hover, .btn-comment:hover{
    background: #009056;
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
    transition-delay: .5s;
  }

  .panel h3{
    font-size: 24px;
    font-weight: 600;
  }

  .panel p{
    font-size: 15px;
    padding: 10px 0;
  }

  .left-panel .image,
  .left-panel .content{
    transform: translateX(-250%)
  }

  .right-panel .image,
  .right-panel .content{
    transform: translateX(0)
  }

  .container.modify-mode::before{
    transform: translateX(0);
  }

  .container.modify-mode .right-panel .image,
  .container.modify-mode .right-panel .content {
    transform: translateX(250%)
  }

  .container.modify-mode .left-panel .image,
  .container.modify-mode .left-panel .content {
    transform: translateX(0);
  }

  .container.modify-mode div.table-content{
    opacity: 0;
  }

  .container.modify-mode form.task-form{
    opacity: 1;
  }

  .container.modify-mode .right-panel{
    pointer-events: none;
  }

  .container.modify-mode .left-panel{
    pointer-events: all;
  }
</style>