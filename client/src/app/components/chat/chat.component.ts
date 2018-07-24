import { Component, OnInit } from '@angular/core';
import {ChatService} from'../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  display;
  messages = [];
  connection;
  message;
  constructor(private chatService:ChatService) { }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      console.log(message)
      this.messages.push(message);
    })
  }

  openModal(){
    this.display='popup-box-on';
    return false;
  }

  closeModel(){
    this.display='';
    return false;
  }

  sendMessage(){
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
