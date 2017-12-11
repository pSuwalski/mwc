import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AppComponent } from './app.component';
import { UserResolver } from './resolvers/user-resolver';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HomeComponent } from './components/home/home.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { SearchComponent } from './components/search/search.component';
import { SearchresultComponent } from './components/search/searchresult/searchresult.component';
import { SearchrecordComponent } from './components/search/searchrecord/searchrecord.component';
import { TemplateslistComponent } from './components/documents/templateslist/templateslist.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { AddParcelComponent } from './components/add-parcel/add-parcel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { SearchParcelComponent } from './components/search-parcel/search-parcel.component';
import { AddOwnerComponent } from './components/add-owner/add-owner.component';
import { AddResolutionComponent } from './components/add-resolution/add-resolution.component';
import { AddWorksdoneComponent } from './components/add-worksdone/add-worksdone.component';
import { SearchOwnerComponent } from './components/search-owner/search-owner.component';
import { SearchResolutionComponent } from './components/search-resolution/search-resolution.component';
import { AddSectionComponent } from './components/add-section/add-section.component';
import { SearchSectionComponent } from './components/search-section/search-section.component';
import { SectionOutputDataFormComponent } from './components/output-data-forms/section-output-data-form/section-output-data-form.component';
import { ParcelOutputDataFormComponent } from './components/output-data-forms/parcel-output-data-form/parcel-output-data-form.component';
import { OwnerOutputDataFormComponent } from './components/output-data-forms/owner-output-data-form/owner-output-data-form.component';
import { ResolutionOutputDataFormComponent } from './components/output-data-forms/resolution-output-data-form/resolution-output-data-form.component';
import { SearchWorksdoneComponent } from './components/search-worksdone/search-worksdone.component';
import { WorksOutputDataFormComponent } from './components/output-data-forms/works-output-data-form/works-output-data-form.component';

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
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [UserResolver]
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
        path: 'add/section',
        component: AddSectionComponent,
      },
      {
        path: 'add/parcel',
        component: AddParcelComponent,
      },
      {
        path: 'add/owner',
        component: AddOwnerComponent,
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
        // component: SearchComponent,
        children: [
          {
            path: 'parcel',
            component: SearchParcelComponent,
          },
          {
            path: 'leesee',
            component: SearchOwnerComponent,
          },
          {
            path: 'resolution',
            component: SearchResolutionComponent,
          },
          {
            path: 'searchresult',
            component: SearchresultComponent,
          },
          {
            path: 'section',
            component: SearchSectionComponent,
          },
          {
            path: 'works',
            component: SearchWorksdoneComponent,
          },
        ]
      },
      {
        path: 'view',
        children: [
          {
            path: 'section',
            component: SectionOutputDataFormComponent,
          },
          {
            path: 'parcel',
            component: ParcelOutputDataFormComponent,
          },
          {
            path: 'owner',
            component: OwnerOutputDataFormComponent,
          },
          {
            path: 'resolution',
            component: ResolutionOutputDataFormComponent,
          },
          {
            path: 'works',
            component: WorksOutputDataFormComponent,
          },
        ]
      },
    ],
    canActivate: [UserResolver]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
