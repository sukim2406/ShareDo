import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCWvU9Q1DEInxKqkKTf7CWYgx2Tb-IZCkM",
    authDomain: "vue-sharedo.firebaseapp.com",
    projectId: "vue-sharedo",
    storageBucket: "vue-sharedo.appspot.com",
    messagingSenderId: "327741505869",
    appId: "1:327741505869:web:10845b2ad8edd0dae43704"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig)

