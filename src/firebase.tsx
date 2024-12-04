import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAzTry71t-9r-b3Ri7JIh5wK6co7piI8tA',
    authDomain: 'nwitter-reloaded-90aa1.firebaseapp.com',
    projectId: 'nwitter-reloaded-90aa1',
    storageBucket: 'nwitter-reloaded-90aa1.appspot.com',
    messagingSenderId: '339776569232',
    appId: '1:339776569232:web:39634ee4792abb1d2b3d15',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
