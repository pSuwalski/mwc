import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AppComponent } from './app.component';
import { UserResolver } from './resolvers/user-resolver';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HomeComponent } from './components/home/home.component';
import { AddComponent } from './components/add/add.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { SearchComponent } from './components/search/search.component';
import { SearchresultComponent } from './components/search/searchresult/searchresult.component';
import { SearchrecordComponent } from './components/search/searchrecord/searchrecord.component';
import { TemplateslistComponent } from './components/documents/templateslist/templateslist.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'add',
        component: AddComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
        children: [
          {
            path: 'templateslist',
            component: TemplateslistComponent
          }
        ]
      },
      {
        path: 'search',
        component: SearchComponent,
        children: [
          {
            path: '',
            component: SearchrecordComponent,
          },
          {
            path: 'searchresult',
            component: SearchresultComponent,
          },
        ]
      },
      // { not implemented
      //     path: 'search',
      //     component: SearchComponent,
      // }
    ],
    canActivate: [UserResolver] //  # will be usefull when implementing Auth
  },
  {
    path: '**',
    redirectTo: ''
  }
];
