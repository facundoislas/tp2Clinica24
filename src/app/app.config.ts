import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"clinica-22442","appId":"1:235357332503:web:e03014e1b1fcb0af3b6852","storageBucket":"clinica-22442.appspot.com","apiKey":"AIzaSyCYJNO1mUpzxRzCSi7jWwwquq2q-8KAETU","authDomain":"clinica-22442.firebaseapp.com","messagingSenderId":"235357332503"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()),provideAnimations(), provideAnimationsAsync(), provideCharts(withDefaultRegisterables()), provideCharts(withDefaultRegisterables()), provideCharts(withDefaultRegisterables())]
};
