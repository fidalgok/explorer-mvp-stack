import { getAuth, signInWithPopup, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import config from './firebase-config';
import { type FirebaseConfig } from './firebase-config';



const getFirebaseConfig = (): FirebaseConfig => {
  try {


    // Validate that all required fields are present and are strings
    const requiredFields: (keyof FirebaseConfig)[] = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = config[field];
      return !value || typeof value !== 'string';
    });

    if (missingFields.length > 0) {
      throw new Error(
        `Firebase configuration is missing required fields or has invalid types: ${missingFields.join(', ')}\n` +
        'Please check your firebaseConfig.ts file.'
      );
    }

    return config;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Firebase configuration file (firebaseConfig.ts) not found.\n' +
        'Please create this file based on firebaseConfig.example.ts'
      );
    }
    throw error;
  }
};

const initializeFirebase = (): { app: FirebaseApp; auth: Auth } => {
  const firebaseConfig = getFirebaseConfig();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  return { app, auth };
};

// Initialize Firebase
const { auth } = initializeFirebase();
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    // Get the ID token
    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
}
