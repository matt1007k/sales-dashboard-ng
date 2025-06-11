import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login/login';
import { Error } from './error';
import { ForgotPassword } from './forgot-password/forgot-password';

export default [
  { path: 'access', component: Access },
  { path: 'error', component: Error },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
] as Routes;
