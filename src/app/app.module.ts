import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MainToolbarComponent } from '@shared/ui/navigation/main-toolbar';

import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    CoreModule,

    // TODO: Could move these to the CoreModule, but it's not really necessary.
    BrowserModule,
    HttpClientModule,

    // TODO: Decide whether to keep the animations module. Is it still the same crap it used to be?
    BrowserAnimationsModule,
    // TODO: Decide whether to export the ServiceWorkerModule to own file.
    // Currently keeping it here to avoid complicating changes for cloud Messaging.
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),

    MainToolbarComponent,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
