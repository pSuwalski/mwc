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
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdRippleModule
} from '@angular/material';

import { RouterModule, Routes } from '@angular/router';
import * as router from './app.routes';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireAuthModule } from 'angularfire2/auth';


import { AddComponent } from './components/add/add.component';
import { AppComponent } from './app.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { HistoryComponent } from './components/shared/history/history.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationToolbarComponent } from './components/shared/navigation-toolbar/navigation-toolbar.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PersonalDataFormComponent } from './components/shared/personal-data-form/personal-data-form.component';
import { SearchComponent } from './components/search/search.component';
import { SearchresultComponent } from './components/search/searchresult/searchresult.component';
import { SearchrecordComponent } from './components/search/searchrecord/searchrecord.component';
import { TemplateslistComponent } from './components/documents/templateslist/templateslist.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { UserResolver } from './resolvers/user-resolver';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [AddComponent, AppComponent, DocumentsComponent, HistoryComponent, HomeComponent,
    LoginPageComponent, MainPageComponent, NavigationToolbarComponent, PersonalDataFormComponent,
    SearchComponent, SearchresultComponent, SearchrecordComponent, TemplateslistComponent],
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
    MdRippleModule,
    MdTableModule,
    MdTabsModule,
    MdToolbarModule,
    NoopAnimationsModule,
    RouterModule.forRoot(router.appRoutes),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [UserResolver, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
