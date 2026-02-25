import { Routes } from '@angular/router';
import { Login } from './modules/login/login';
import { Registration } from './modules/registration/registration';
import { Sidebar } from './modules/sidebar/sidebar';
import { Posts } from './pages/posts/posts';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  //   {
  //     path: '',
  //     component: Login,
  //   },
  //   {
  //     path: 'regi',
  //     component: Registration,
  //   },
  //   {
  //     path: 'home',
  //     component: Posts,
  //   },

  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', component: Login },
      { path: 'regi', component: Registration },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayout,
    children: [
      //   { path: 'feed', component: FeedComponent },
      { path: 'home', component: Posts },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
