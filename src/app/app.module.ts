import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdToolbarModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import * as router from './app.routes';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireAuthModule } from 'angularfire2/auth';



import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HomeComponent } from './components/home/home.component';
import { AddComponent } from './components/add/add.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { SearchresultComponent } from './components/searchresult/searchresult.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginPageComponent, MainPageComponent, AddComponent, DocumentsComponent, SearchresultComponent],
  imports: [
    // AngularFireAuthModule,
    // AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdToolbarModule,
    NoopAnimationsModule,
    RouterModule.forRoot(router.appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
