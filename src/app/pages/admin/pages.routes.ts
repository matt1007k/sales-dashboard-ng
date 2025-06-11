import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';
import { Products } from './products/products';

export default [
  { title: 'Dashbaord', path: '', component: Dashboard },
  { title: 'Usuarios', path: 'users', component: Users },
  { title: 'Productos', path: 'products', component: Products },
] as Routes;
