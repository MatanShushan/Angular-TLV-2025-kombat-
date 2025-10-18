import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUfPdlQBb32oCx88THKFeBkNrB1NUQTFM",
  authDomain: "ng-tlv-kombat.firebaseapp.com",
  projectId: "ng-tlv-kombat",
  storageBucket: "ng-tlv-kombat.firebasestorage.app",
  messagingSenderId: "71058915589",
  appId: "1:71058915589:web:3b52a5415f33685d04b76c",
  measurementId: "G-HZSPZKH701"
};





export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};
