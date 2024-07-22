import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"clinica-22442","appId":"1:235357332503:web:e03014e1b1fcb0af3b6852","storageBucket":"clinica-22442.appspot.com","apiKey":"AIzaSyCYJNO1mUpzxRzCSi7jWwwquq2q-8KAETU","authDomain":"clinica-22442.firebaseapp.com","messagingSenderId":"235357332503"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideAnimationsAsync()]
};
