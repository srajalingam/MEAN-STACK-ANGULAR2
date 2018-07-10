import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import {HomeComponent} from './components/home/home.component';

import{DashboardComponent} from './components/dashboard/dashboard.component';

import {RegisterComponent} from './components/register/register.component';

import {LoginComponent} from './components/login/login.component';

import {ProfileComponent} from './components/profile/profile.component';

import {PublicProfileComponent} from './components/public-profile/public-profile.component';

import {BlogComponent} from './components/blog/blog.component';

import {EditBlogComponent} from './components/edit-blog/edit-blog.component';

import {DeleteBlogComponent} from './components/blog/delete-blog/delete-blog.component';

import{AuthGuard} from './guards/auth.guard';

import{NotAuthGuard} from './guards/notAuth.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]}, //canActivate if logedin this route will be activate
  { path: 'register', component: RegisterComponent,canActivate:[NotAuthGuard] },
  {path:'login',component:LoginComponent,canActivate:[NotAuthGuard] },
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'blog',component:BlogComponent},
  {path:'edit-blog/:id',component:EditBlogComponent,canActivate:[AuthGuard]},
  {path:'delete-blog/:id',component:DeleteBlogComponent,canActivate:[AuthGuard]},
  {path:'user/:username',component:PublicProfileComponent,canActivate:[AuthGuard]},
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
