import { FlashMessage } from 'angular2-flash-messages/module/flash-message';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login-service';
import Swal from 'sweetalert2';
import { trigger, style, animate, transition } from '@angular/animations';
import { LoaderService } from 'src/app/servicios/loader.service';

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
  isLoading = false;
  email:string;
  password:string;

  constructor(
    private router:Router,
    private flashMessage:FlashMessagesService,
    private loginService:LoginService,
    private loaderService: LoaderService
    ) { }

  ngOnInit(): void {
    // Puedes suscribirte al servicio para actualizar isLoading cuando cambie
    this.loaderService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    // this.loginService.getAuth().subscribe(auth=>{
    //   if(auth){
    //     this.router.navigate(['/'])
    //   }
    // });

  }


  login(event: Event) {
    event.preventDefault();
    console.log('isLoading value:', this.isLoading); // Agrega este console.log

    // Mostrar el loader
    this.loaderService.showLoader();
    console.log('isLoading value:', this.isLoading);
    // Resto de la lógica de inicio de sesión...
    // Por ejemplo, llamadas a servicios, autenticación, etc.

    // Aquí deberías tener alguna lógica que indique cuando el proceso de inicio de sesión ha terminado
    // y luego ocultar el loader
    this.loaderService.hideLoader();
    console.log('isLoading value:', this.isLoading);
    // if(this.email === undefined || this.password === undefined) {
    //   this.loaderService.hideLoader();
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'No se ha podido iniciar sesión, verifique los datos',
    //     text: 'No pueden existir campos vacíos',
    //   });
    //   return;
    // }

    // this.loginService.login(this.email,this.password)
    // .then(res =>{
    //   this.router.navigate(['/']);
    // })
    // .catch(error=>{
    //   // Utiliza SweetAlert2 para mostrar el mensaje de error
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'No se ha podido iniciar sesión, verifique los datos',
    //     text: error.message,
    //   });
    // });
  }
}
