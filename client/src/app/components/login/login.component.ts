import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import{AuthGuard} from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form:FormGroup;
  message;
  messageClass;

  previousUrl;


  constructor(
    private formbuilder:FormBuilder,
    private authService:AuthService,
    private router : Router,
    private authGuard:AuthGuard
  ) {
    this.createForm();
  }

  createForm(){
    this.form=this.formbuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  onLoginSubmit(){
    const user={
      username:this.form.get('username').value,
      password:this.form.get('password').value
    }

    this.authService.login(user).subscribe((data)=>{
      if(!data.success){
        this.messageClass="alert alert-danger";
        this.message=data.message;
      }else{
        this.messageClass="alert alert-success";
        this.message = data.message;
        this.authService.storeUserData(data.token,data.user);
        setTimeout(()=>{
          if(this.previousUrl){
            this.router.navigate([this.previousUrl]);
          }else{
            this.router.navigate(['/dashboard']);
          }
        })
      }
    })
  }
  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass="alert alert-danger";
      this.message = 'you must be logged in to view that page.';
      this.previousUrl=this.authGuard.redirectUrl;
      this.authGuard.redirectUrl=undefined;
    }
  }

}
