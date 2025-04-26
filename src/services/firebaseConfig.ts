// Importa o Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEwToqikiemBXeACjZJnjhSlEIElmW3cY",
  authDomain: "unitecaapp.firebaseapp.com",
  projectId: "unitecaapp",
  storageBucket: "unitecaapp.firebasestorage.app",
  messagingSenderId: "937746604236",
  appId: "1:937746604236:web:e777ac12665b2cfa486269"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
