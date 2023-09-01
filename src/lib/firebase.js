import {
	initializeApp
} from 'firebase/app';
import {
	getFirestore
} from 'firebase/firestore';
import {
	getAuth
} from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAoMgQCuzqrIQc2E3Bus41YRsIDyhGGA1w",
    authDomain: "aioaio.firebaseapp.com",
    projectId: "aioaio",
    storageBucket: "aioaio.appspot.com",
    messagingSenderId: "69762931915",
    appId: "1:69762931915:web:06a2a829d519e242e20f4e",
    measurementId: "G-CVXLF6SDQY"
  };

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);