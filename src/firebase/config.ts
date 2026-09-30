import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
 
const firebaseConfig = {
  apiKey: 'AIzaSyB00IktZxoIxLouOTg0eUc2Qxg1O5hhb8A',
  authDomain: 'techcall2.firebaseapp.com',
  projectId: 'techcall2',
  storageBucket: 'techcall2.firebasestorage.app',
  messagingSenderId: '159735992707',
  appId: '1:159735992707:web:fb382fc4efc4ff9794e6b6',
};
 
const app = initializeApp(firebaseConfig);
 
export const db = getFirestore(app);
 
// Identificador do aluno — usado para isolar os dados de cada
// um dentro do mesmo projeto Firebase compartilhado da turma.
// Cada aluno troca este valor pelo seu RA.
export const ALUNO_ID = 'RA2457087';
