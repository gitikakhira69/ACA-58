import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyCImBRajGduC-eFn0_d-05ad7ndyFqV61g",
    authDomain: "class-56.firebaseapp.com",
    projectId: "class-56",
    storageBucket: "class-56.appspot.com",
    messagingSenderId: "895007177219",
    appId: "1:895007177219:web:3ca2de362be8385059ec36"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.storage();