import { firebaseApp } from './firebase-app'
import { addUser } from './firebase-store'
import firebase from 'firebase'
const auth = firebaseApp.auth()

const initializeAuth = new Promise(resolve => {
    auth.onAuthStateChanged(user => {
        authService.setUser(user)
        resolve(user)
    })
})

export const authService = {
    user: null,

    authenticated() {
        return initializeAuth.then(user => {
            return user && !user.isAnonymous
        })
    },

    setUser(user) {
        this.user = user
    },

    login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
            .then(console.log("logged in as ", this.user.email))
            .catch(error => alert(error.message))
    },

    logout() {
        auth.signOut().then(() =>{
            console.log('logged out')
        })
    },

    register(email, password, name, department, greet) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("logged in as ", userCredential.user.email)
                addUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    name: name,
                    depart: department,
                    greet: greet,
                    tasks: [],
                })
            })
            .catch(error => alert(error.message))
    },

    passwordReset(curPassword, newPassword){
        let curUser = auth.currentUser
        const credential = firebase.auth.EmailAuthProvider.credential(curUser.email, curPassword)
        curUser.reauthenticateWithCredential(credential)
            .then(() => {
                curUser.updatePassword(newPassword)
                    .then(() => {
                        console.log("password updated")
                    })
            })
    }
}