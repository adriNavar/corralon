import { FlashMessage } from 'angular2-flash-messages/module/flash-message';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login-service';
import Swal from 'sweetalert2';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
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
    
    if(this.email === undefined || this.password === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'No se ha podido iniciar sesión, verifique los datos',
        text: 'No pueden existir campos vacíos',
      });
      return;
    }

    this.loginService.login(this.email,this.password)
    .then(res =>{
      this.router.navigate(['/']);
    })
    .catch(error=>{
      // Utiliza SweetAlert2 para mostrar el mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'No se ha podido iniciar sesión, verifique los datos',
        text: error.message,
      });
    });
  }
}
