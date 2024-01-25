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

  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'): void {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
    });
  }


  login() {
    console.log(this.email, this.password);
  
    // Mostrar el loader
    this.loaderService.showLoader();
  
    // Algunas validaciones
    if (this.email === undefined || this.email === "" || this.password === "" || this.password === undefined) {
      const sweetAlertTitle: string = 'No se ha podido iniciar sesión, verifique los datos';
      const sweetAlertText: string = 'No pueden existir campos vacíos';
      const sweetAlertIcon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'error';
      this.loaderService.hideLoader();
      this.showAlert(sweetAlertTitle, sweetAlertText, sweetAlertIcon);
      return;
    }
  
    this.loginService.login(this.email, this.password)
      .then(res => {
        this.loaderService.hideLoader();
        // Realizar acciones directamente dentro de la promesa
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.loaderService.hideLoader();
  
        if (error.code === 'auth/invalid-login-credentials') {
          const sweetAlertTitle: string = 'No se ha podido iniciar sesión, verifique los datos';
          const sweetAlertText: string = 'Los datos no son correctos !';
          const sweetAlertIcon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'warning';
          this.showAlert(sweetAlertTitle, sweetAlertText, sweetAlertIcon);
          return;
        } else if (error.code === 'auth/invalid-email') {
          const sweetAlertTitle: string = 'No se ha podido iniciar sesión, verifique los datos';
          const sweetAlertText: string = 'El formato del email es incorrecto !';
          const sweetAlertIcon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'warning';
          this.showAlert(sweetAlertTitle, sweetAlertText, sweetAlertIcon);
          return;
        } else {
          const sweetAlertTitle: string = 'No se ha podido iniciar sesión';
          const sweetAlertText: string = 'Error externo, por favor intente nuevamente en breve !';
          const sweetAlertIcon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info';
          this.showAlert(sweetAlertTitle, sweetAlertText, sweetAlertIcon);
          return;
        }
      });
  }
  
}
