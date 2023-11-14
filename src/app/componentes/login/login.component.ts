import { FlashMessage } from 'angular2-flash-messages/module/flash-message';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
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

    this.loginService.getAuth().subscribe(auth=>{
       if(auth){
         this.router.navigate(['/'])
       }
     });

  }


  login() {
    console.log(this.email, this.password); // Agrega este console.log

    // Mostrar el loader
    this.loaderService.showLoader();

    // Algunas validaciones
    if(this.email === undefined || this.email === "" || this.password === "" || this.password === undefined) {
        this.loaderService.hideLoader();
        Swal.fire({
          icon: 'error',
          title: 'No se ha podido iniciar sesión, verifique los datos',
          text: 'No pueden existir campos vacíos',
        });
        return;
      }

    this.loginService.login(this.email,this.password)
    .then(res =>{
      this.loaderService.hideLoader();
      this.router.navigate(['/']);
    })
    .catch(error=>{
      this.loaderService.hideLoader();

      // Manejar errores específicos de Firebase
      if (error.code === 'auth/invalid-login-credentials') {
        // Utiliza SweetAlert2 para mostrar el mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'No se ha podido iniciar sesión, verifique los datos',
          text: 'DATOS INVÁLIDOS !',
        });
        return;
        // Puedes mostrar un mensaje al usuario o realizar alguna acción específica
      } else {
        // Manejar otros errores de Firebase o desconocidos
        Swal.fire({
          icon: 'error',
          title: 'No se ha podido iniciar sesión, verifique los datos',
          text: 'ERROR DE LOGIN !',
        });
        return;
      }
      // Utiliza SweetAlert2 para mostrar el mensaje de error
      
    });

    this.cdr.detectChanges();
  }
}
