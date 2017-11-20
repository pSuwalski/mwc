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
import { AddParcelComponent } from './components/add-parcel/add-parcel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { SearchParcelComponent } from './components/search-parcel/search-parcel.component';
import { AddLeeseeComponent } from './components/add-leesee/add-leesee.component';
import { AddResolutionComponent } from './components/add-resolution/add-resolution.component';
import { AddWorksdoneComponent } from './components/add-worksdone/add-worksdone.component';
import { SearchLeeseeComponent } from './components/search-leesee/search-leesee.component';

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
        path: 'admin-panel',
        component: AdminPanelComponent,
      },
      {
        path: 'add/parcel',
        component: AddParcelComponent,
      },
      {
        path: 'add/leesee',
        component: AddLeeseeComponent,
      },
      {
        path: 'add/resolution',
        component: AddResolutionComponent,
      },
      {
        path: 'add/works',
        component: AddWorksdoneComponent,
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
            path: 'parcel',
            component: SearchParcelComponent,
          },
          {
            path: 'leesee',
            component: SearchLeeseeComponent,
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
