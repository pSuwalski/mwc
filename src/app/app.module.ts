import { CompanyService } from './services/company.service';
import { SectionService } from './services/section.service';
import { ResolutionsService } from './services/resolutions.service';
import { OwnerService } from './services/owner.service';
import { Owner } from './models/owner';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDatepickerModule,
  MdExpansionModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdNativeDateModule,
  MdProgressBarModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdRippleModule,
  MdMenuModule
} from '@angular/material';

import { RouterModule, Routes } from '@angular/router';
import * as router from './app.routes';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireAuthModule } from 'angularfire2/auth';


import { AddParcelComponent } from './components/add-parcel/add-parcel.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { InfoComponent } from './components/shared/info/info.component';
import { HistoricSaldoFormComponent } from './components/shared/historic-saldo-form/historic-saldo-form.component';
import { ContactDataFormComponent } from './components/shared/contact-data-form/contact-data-form.component';
import { OwnerParcelFormComponent } from './components/shared/owner-parcel-form/owner-parcel-form.component';
import { AuthorizationsDataFormComponent } from './components/shared/authorizations-data-form/authorizations-data-form.component';
import { LegalbasisDataFormComponent } from './components/shared/legalbasis-data-form/legalbasis-data-form.component';
import { ParcelsDataFormComponent } from './components/shared/parcels-data-form/parcels-data-form.component';
import { PaymentsDataFormComponent } from './components/shared/payments-data-form/payments-data-form.component';
import { WorksdoneDataFormComponent } from './components/shared/worksdone-data-form/worksdone-data-form.component';
import { CompanyDataFormComponent } from './components/shared/company-data-form/company-data-form.component';
import { UserResolver } from './resolvers/user-resolver';
import { UserService } from './services/user.service';
import { GraphQlService } from './services/graphQl.service';
import { WorksService } from './services/works.service';
import { HttpModule } from '@angular/http';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { DatabaseService } from './services/database.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ParcelService } from './services/parcel.service';
import { SearchParcelComponent } from './components/search-parcel/search-parcel.component';
import { AddOwnerComponent } from './components/add-owner/add-owner.component';
import { AddResolutionComponent } from './components/add-resolution/add-resolution.component';
import { AddWorksdoneComponent } from './components/add-worksdone/add-worksdone.component';
import { SearchOwnerComponent } from './components/search-owner/search-owner.component';
import { SearchResolutionComponent } from './components/search-resolution/search-resolution.component';
import { AddSectionComponent } from './components/add-section/add-section.component';
import { SectionDataFormComponent } from './components/shared/section-data-form/section-data-form.component';
import { SearchSectionComponent } from './components/search-section/search-section.component';
import { SectionOutputDataFormComponent } from './components/output-data-forms/section-output-data-form/section-output-data-form.component';
import { EditSectionComponent } from './components/edit/edit-section/edit-section.component';



@NgModule({
  declarations: [AddParcelComponent, AdminPanelComponent, AppComponent,
    DocumentsComponent, HistoricSaldoFormComponent, HistoryComponent, HomeComponent, InfoComponent,
    LoginPageComponent, MainPageComponent, NavigationToolbarComponent, OwnerParcelFormComponent,
    PersonalDataFormComponent, SearchComponent, SearchParcelComponent, SearchresultComponent, SearchrecordComponent, TemplateslistComponent,
    ContactDataFormComponent, AuthorizationsDataFormComponent, LegalbasisDataFormComponent,
    ParcelsDataFormComponent,
    PaymentsDataFormComponent,
    RegisterPageComponent,
    WorksdoneDataFormComponent,
    CompanyDataFormComponent,
    AddOwnerComponent,
    AddResolutionComponent,
    AddWorksdoneComponent,
    SearchOwnerComponent,
    SearchResolutionComponent,
    AddSectionComponent,
    SectionDataFormComponent,
    SearchSectionComponent,
    SectionOutputDataFormComponent,
    EditSectionComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdCardModule,
    MdDatepickerModule,
    MdExpansionModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule,
    MdProgressBarModule,
    MdRippleModule,
    MdTableModule,
    MdTabsModule,
    MdToolbarModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(router.appRoutes),
    FormsModule,
    MdSelectModule,
  ],
  providers: [GraphQlService, DatabaseService, UserResolver, UserService, ParcelService, OwnerService,
              ResolutionsService, SectionService, WorksService, CompanyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
