<template>
    <div class="header-container">
        <Header />
    </div>
    <div class="container">
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
    </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../firebase-auth'
import { createTask, userService } from '../firebase-store'
import firebase from 'firebase'
import Header from '../components/Header.vue'

export default {
    components: {
        Header
    },

    setup(){
        const router = useRouter()
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
            AddContributor,
            CreateTask
        }
    }
}
</script>