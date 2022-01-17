import {firebaseApp} from  './firebase-app'

const db = firebaseApp.firestore()
const usersCollection = db.collection('users')
const tasksCollection = db.collection('tasks')

export const addUser = userData => {
    return usersCollection.add({...userData})
        .catch(error => alert("Error", error.message))
}

export const getUserInfo = uid => {
    return usersCollection.where("uid", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                return doc.data.name
            })
        })
        .catch((error) => {
            alert("Error", error.message)
        })
}

export const userService = {
    doc: null,

    getUserName(uid) {
        return usersCollection.where("uid", "==", uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.doc = doc
                })  
            })
    },

    updateUser(user) {
        return usersCollection.doc(this.doc.id).update(user)
            .catch((error) => {
                alert("Error", error.message)
            })
    },

    getUserByEmail(email) {
        return usersCollection.where("email", "==", email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.doc = doc
                })
            })
            .catch((error) => alert("Error", error.message))
    },

    resetDoc() {
        this.doc = null
    }

    
}

export const createTask = taskData => {
    return tasksCollection.add({...taskData})
        .catch(error => alert("Error", error.message))
}

export const taskService = {
    doc: null,

    getTask(id) {
        return tasksCollection.doc(id)
            .get()
            .then((doc) => {
                this.doc = doc
            })
    },

    updateTask(id, taskData){
        return tasksCollection.doc(id).update(taskData)
            .catch((error) => {
                alert("Error", error.message)
            })
    }
}

export const getTaskInfo = id => {
    return tasksCollection.doc(id)
        .get()
        .catch((error) => {
            alert("Error", error.message)
        })
    
}

export const getSnapshot = async () => {
    const snapshot = await tasksCollection.get()

    return snapshot.docs.map(doc => doc.data())
}