import { Routes } from '@angular/router';
import { Login } from './modules/login/login';
import { Registration } from './modules/registration/registration';
import { Sidebar } from './modules/sidebar/sidebar';
import { Posts } from './pages/posts/posts';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Profile } from './pages/profile/profile';
import { Networks } from './pages/networks/networks';
import { CreatePost } from './pages/createpost/createpost';
import { Feed } from './pages/feed/feed';
import { Notifications } from './pages/notification/notification';

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
      { path: 'login', component: Login },
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
      { path: 'profile', component: Profile },
      { path: 'networks', component: Networks },
      { path: 'creatpost', component: CreatePost },
      { path: 'feed', component: Feed },
      { path: 'notification', component: Notifications },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
