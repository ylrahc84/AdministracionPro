import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

//CAMBIAR EL LOCALE DE L APP

import localEsCR from '@angular/common/locales/es-CR';
import { registerLocaleData } from '@angular/common';

registerLocaleData( localEsCR );

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    AngularMyDatePickerModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'es-CR'
    }
  ]
})
export class AppModule { }
