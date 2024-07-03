
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyATp2OY1Xwn2Stdsi4fzdWqf4u5DeodkDg",
  authDomain: "tickets-aec80.firebaseapp.com",
  projectId: "tickets-aec80",
  storageBucket: "tickets-aec80.appspot.com",
  messagingSenderId: "12959684187",
  appId: "1:12959684187:web:542905888b40b16546117e",
  measurementId: "G-WX25H4ECYH"
};


const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };