import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_JCRD3Bd-OhWWMvmXiUsapxchrM2YnbU",
    authDomain: "birthday-website-81939.firebaseapp.com",
    projectId: "birthday-website-81939",
    storageBucket: "birthday-website-81939.appspot.com",
    messagingSenderId: "15264836352",
    appId: "1:15264836352:web:4e5b6636d1fa30758721e5",
    measurementId: "G-HX7FKTHDS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Enable CORS for development
// if (window.location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectStorageEmulator(storage, 'localhost', 9199);
// }

export { db, storage }; 