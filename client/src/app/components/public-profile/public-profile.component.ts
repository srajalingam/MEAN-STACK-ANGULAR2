import { Component, OnInit } from '@angular/core';

import{AuthService} from '../../services/auth.service';

import{ ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl;
  username;
  email;

  constructor(private authService:AuthService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.currentUrl=this.activatedRoute.snapshot.params;
    console.log(this.currentUrl)
    this.authService.getPublicProfile(this.currentUrl.username).subscribe(data=>{
      console.log(data)
      this.username=data.user.username;
      this.email=data.user.email;
    })

  }

}
