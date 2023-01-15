import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '@env/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AuthGuardModule } from '@angular/fire/auth-guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
  ],
  exports: [AuthGuardModule],
  providers: [ScreenTrackingService, UserTrackingService],
})
export class FirebaseModule {}
