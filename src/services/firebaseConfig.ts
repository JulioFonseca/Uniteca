// src/services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: 'AIzaSyAEwToqikiemBXeACjZJnjhSlEIElmW3cY',
  authDomain: 'unitecaapp.firebaseapp.com',
  projectId: 'unitecaapp',
  storageBucket: 'unitecaapp.firebasestorage.app',
  messagingSenderId: '937746604236',
  appId: '1:937746604236:web:e777ac12665b2cfa486269',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
