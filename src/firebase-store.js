import {firebaseApp} from  './firebase-app'

const db = firebaseApp.firestore()
const usersCollection = db.collection('users')
const tasksCollection = db.collection('tasks')

export const addUser = userData => {
    return usersCollection.add({...userData})
        .catch(error => alert(error.message))
}

export const getUserInfo = uid => {
    return usersCollection.where("uid", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data())
                return doc.data.name
            })
        })
        .catch((error) => {
            console.log("Error getting documents", error)
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
                console.log("Error updating user info", error)
            })
    },

    getUserByEmail(email) {
        return usersCollection.where("email", "==", email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.doc = doc
                    console.log(doc.data())
                })
            })
            .catch((error) => alert("Error", error))
    },

    resetDoc() {
        this.doc = null
    }

    
}

export const createTask = taskData => {
    return tasksCollection.add({...taskData})
        .catch(error => alert(error.message))
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
            .then(()=> {
                console.log("Document successfully updated!")
            })
            .catch((error) => {
                console.error("Error updating document: ", error)
            })
    }
}

export const getTaskInfo = id => {
    return tasksCollection.doc(id)
        .get()
        .then((doc) => {
            console.log("doc = ", doc.data())
        })
        .catch((error) => {
            console.log("Error getting task info", error)
        })
    
}

export const getSnapshot = async () => {
    const snapshot = await tasksCollection.get()

    return snapshot.docs.map(doc => doc.data())
}