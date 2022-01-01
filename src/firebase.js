import firebase from 'firebase'
import { ref, onUnmounted } from 'vue'

const firebaseConfig = {
    apiKey: "AIzaSyCWvU9Q1DEInxKqkKTf7CWYgx2Tb-IZCkM",
    authDomain: "vue-sharedo.firebaseapp.com",
    projectId: "vue-sharedo",
    storageBucket: "vue-sharedo.appspot.com",
    messagingSenderId: "327741505869",
    appId: "1:327741505869:web:10845b2ad8edd0dae43704"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const auth = firebaseApp.auth()
const db = firebaseApp.firestore()
const usersCollection = db.collection('users')

export const loginUser = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
    .then(data => console.log(data.uid))
    .catch(err => alert(err.message))
}

export const createUser = async userData => {
    const uid = ref("")
    await auth.createUserWithEmailAndPassword(userData.email, userData.password)
        .then((userCredential) => {
            uid.value = userCredential.user.uid
        })
        .catch(error => alert(error.message))
    return usersCollection.add({
        uid: uid.value,
        email: userData.email,
        name: userData.name,
    })
}

export const getUser = async id => {
    const user = await usersCollection.doc(id).get()
    console.log(user)
    return user.exists ? user.data() : null
}

export const updateUser = (id, user) => {
    return usersCollection.doc(id).update(user)
}

export const deleteUser = id => {
    return usersCollection.doc(id).delete()
}

export const useLoadUsers = () => {
    const users = ref([])
    const close = usersCollection.onSnapshot(snapshot => {
        users.value = snapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
    })
    onUnmounted(close)
    return users    
}

// export const isLoggedIn = async () => {
//     try {
//         await new Promise((resolve, reject) =>
//             firebase.auth().onAuthStateChanged(
//                 user=> {
//                     if(user) {
//                         resolve('User is here')
//                     }
//                     else{
//                         reject('There is no user')
//                     }
//                 },

//                 error => reject(error)
//             )
//         )
//         return true
//     }
//     catch(error){
//         return false
//     }
// }

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('logged in as ', user.email )
    }
    else{
        console.log('logged out')
    }
})

