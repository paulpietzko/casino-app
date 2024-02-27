import { Routes } from '@angular/router';
import { Login } from './login/login.component';
import { Signup } from './signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
];
