import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,FormBuilder,Validators} from '@angular/forms';
import{AuthService} from '../../services/auth.service';
import{BlogService} from '../../services/blog.service';



@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  message;
  messageClass;
  newPost=false;
  commentForm;
  loadingBlogs=false;
  form;
  username;
  blogPosts;
  newComment=[];
  enabledComments=[];

  constructor(private formBuilder:FormBuilder,private authService:AuthService,private blogService:BlogService) {
    this.createNewBlogForm();
    this.createCommentForm();
   }
   createNewBlogForm(){
    this.form=this.formBuilder.group({
      title:['',Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body:['',Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5),
      ])]
    })
   }

   createCommentForm(){
     this.commentForm=this.formBuilder.group({
       comment:['',Validators.compose([
         Validators.required,
         Validators.minLength(1),
         Validators.maxLength(200)
       ])]
     })
   }

   alphaNumericValidation(controls){
     const regExp=new RegExp(/^[a-zA-z0-9]+$/);
     if(regExp.test(controls.value)){
       return null;
     }else{
       return {'alphaNumericValidation':true};
     }
   }

  newBlogForm(){
    this.newPost=true;
  }

  reloadBlogs(){
    this.loadingBlogs=true;
    this.getAllBlogs();
    setTimeout(()=>{
      this.loadingBlogs=false;
    },4000)
  }
  onBlogSubmit(){
    const blog={
      title:this.form.get('title').value,
      body:this.form.get('body').value,
      createdBy:this.username
    }
    this.blogService.newBlog(blog).subscribe(data=>{
      if(!data.success){
        this.messageClass="alert alert-danger";
        this.message=data.message;
      }else{
        this.messageClass="alert alert-success";
        this.message=data.message;
        this.getAllBlogs();
        setTimeout(()=>{
          this.newPost=false;
          this.message=false;
          this.form.reset();

        },2000)
      }
    })
  }

  goBack(){
    window.location.reload();
  }

  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe(data=>{
      this.blogPosts=data.blogs;
    })
  }

  likeBlog(id){
    this.blogService.likeBlog(id).subscribe(data=>{
      this.getAllBlogs();
    })
  }

  disLikeBlog(id){
    this.blogService.disLikeBlog(id).subscribe(data=>{
      this.getAllBlogs();
    })
  }

  draftComment(id){
    this.newComment=[];
    this.newComment.push(id);
  }

  cancelSubmission(id){
    const index=this.newComment.indexOf(id);
    this.newComment.splice(index,1);
    this.commentForm.reset();
  }

  expand(id){
    this.enabledComments.push(id);
  }

  collapse(id){
    const index=this.enabledComments.indexOf(id);
    this.enabledComments.splice(index,1);
  }

  postComment(id){
    const comment=this.commentForm.get('comment').value;
    this.blogService.postComment(id,comment).subscribe(data=>{
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index,1);
      this.commentForm.reset();
      if(this.enabledComments.indexOf(id)<0){
        this.expand(id);
      }
    })
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(Profile=>{
      this.username=Profile.user.username;
    })

    this.getAllBlogs();
  }

}
