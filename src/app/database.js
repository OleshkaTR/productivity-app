import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAtMPQkCIEzqf5cSPUEb5X1CyRBUa_t4LQ',
  authDomain: 'my-pomodoro-project.firebaseapp.com',
  projectId: 'my-pomodoro-project',
  storageBucket: 'my-pomodoro-project.appspot.com',
  messagingSenderId: '572567881848',
  appId: '1:572567881848:web:fbd4782bc7f5fcbd54058d',
  measurementId: 'G-GVXHH3SZP6',
};

initializeApp(firebaseConfig);

export const firestore = getFirestore();
