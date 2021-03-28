import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCf7Vveiki7QioCNC69Mh5Yl9OTX95jowQ",
    authDomain: "instagram-clone-9208c.firebaseapp.com",
    projectId: "instagram-clone-9208c",
    storageBucket: "instagram-clone-9208c.appspot.com",
    messagingSenderId: "19115656884",
    appId: "1:19115656884:web:62eca8c89b9ec6ec42b9e1",
    measurementId: "G-VL37FVYD3M"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db, auth, storage};