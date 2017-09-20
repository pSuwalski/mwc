import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AppComponent } from './app.component';
// import {UserResolver} from './resolvers/user-resolver';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HomeComponent } from './components/home/home.component';
import { AddComponent } from './components/add/add.component';



export const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: '',
        component: MainPageComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
            {
                path: 'add',
                component: AddComponent,
            },

            // { not implemented
            //     path: 'search',
            //     component: SearchComponent,
            // }
        ]
        // resolve: UserResolver  # will be usefull when implementing Auth
    },
    {
        path: '**',
        redirectTo: ''
    }
];
