import { Injectable } from '@angular/core';
import{Http,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthService} from'./auth.service';
import {BlogService} from'./blog.service';

@Injectable()
export class ChartService {

  domain=this.authService.domain;
  options;
  allBlogs='';

  constructor( private http:Http,private authService:AuthService,private blogService:BlogService) { }

  createAuthenticationHeaders(){
    this.authService.loadToken();
    this.options=new RequestOptions({
      headers:new Headers({
        'Content-Type':'application/json',
        'authorization':this.authService.authToken
      })
    })
  }

  getAllPost(){
    var blogs=this.blogService.getAllBlogs();
    return blogs;
  }

}
