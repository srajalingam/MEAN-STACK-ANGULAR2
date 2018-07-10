import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form:FormGroup;
  message;
  messageClass;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  createForm(){
    this.form = this.formbuilder.group({
      email:['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])],
      username:['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])],
      password:['',Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      confirm:['',Validators.required]
    })
  }

  onRegisterSubmit(){
      const user={
        email:this.form.get('email').value,
        username:this.form.get('username').value,
        password:this.form.get('password').value
      }

      this.authService.registerUser(user).subscribe(data=>{
        console.log(data);
        if(!data.success){
          this.messageClass='alert alert-danger';
          this.message=data.message;
        }else{
          this.messageClass='alert alert-success';
          this.message=data.message;
          setTimeout(()=>{
              this.router.navigate(['/login'])
          },2000)
        }
      })
  }

  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
      if(!data.success){
        this.emailValid=false;
        this.emailMessage=data.message;
      }else{
        this.emailValid=true;
        this.emailMessage=data.message;
      }
    })
  }

  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
      if(!data.success){
        this.usernameValid=false;
        this.usernameMessage=data.message;
      }else{
        this.usernameValid=true;
        this.usernameMessage=data.message;
      }
    })
  }
  constructor(private formbuilder:FormBuilder, private authService:AuthService,private router:Router) {
    this.createForm();
   }

  ngOnInit() {
  }

}
