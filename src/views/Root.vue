<template>
    <div class="card mt-4">
        <table class="table m-0">
            <thead>
                <tr>
                    <th scipe="col">Name</th>
                    <th scipe="col">Email</th>
                    <th scipe="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{ id, name, email } in users" :key="id">
                    <td>{{ name }}</td>
                    <td>{{ email }}</td>
                    <td>
                        <router-link :to="'/edit/${id}'">
                            <button class="btn btn-primary btn-sm me-2">
                                EDIT
                            </button>
                        </router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteUser(id)">
                                DELETE
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { useLoadUsers, deleteUser } from '@/firebase'
import firebase from 'firebase'

export default {
    setup() {
        const users = useLoadUsers()
        console.log(firebase.auth().currentUser)
        return { users, deleteUser }
    }
}
</script>