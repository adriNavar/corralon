import { FlashMessage } from 'angular2-flash-messages/module/flash-message';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string;
  password:string;
  constructor(private router:Router,
              private flashMessage:FlashMessagesService,
              private loginService:LoginService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe(auth=>{
      if(auth){
        this.router.navigate(['/'])
      }
    });
  }


  login(){
    this.loginService.login(this.email,this.password)
    .then(res =>{
      this.router.navigate(['/']);
    })
    .catch(error=>{
      this.flashMessage.show(error.message,{
        cssClass:'alert-danger',timeout:4000
      });
    });
  }
}
