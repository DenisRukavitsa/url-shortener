import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ControlsComponent } from './controls/controls.component';
import { HttpService } from './services/http.service';
import { FirebaseService } from './services/firebase.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '**', component: AppComponent}
    ]),
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDMk-bAinZsDF0pUJFDK60trheqcvQx8mw',
      authDomain: 'url-shortener-10d44.firebaseapp.com',
      databaseURL: 'https://url-shortener-10d44.firebaseio.com',
      projectId: 'url-shortener-10d44',
      storageBucket: 'url-shortener-10d44.appspot.com',
      messagingSenderId: '702083938915'
    }),
    AngularFireDatabaseModule,
  ],
  providers: [HttpService, FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
