import { LoaderService } from 'src/app/servicios/loader.service';
import { ConfiguracionServicio } from './../../servicios/configuracion.service';
import { LoginService } from './../../servicios/login-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})
export class CabeceroComponent implements OnInit {
  isLoading = false;
  mostrarREsponsive_menu = false;//creo esta variable para desplegar menu

  isLoggedIn:boolean;
  loggedInUser:string;
  permitirRegistro: boolean;

  constructor(private loginService:LoginService,
              private router:Router,
              private configuracionServicio:ConfiguracionServicio,
              private loaderService: LoaderService ) { }

  ngOnInit(): void {
    // Puedes suscribirte al servicio para actualizar isLoading cuando cambie
    this.loaderService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.loginService.getAuth().subscribe(auth =>{
      if(auth){
        this.isLoggedIn=true;
        this.loggedInUser=auth.email;
      }
      else
      this.isLoggedIn=false;
    });

    this.configuracionServicio.getConfiguracion().subscribe(configuracion=>{
      this.permitirRegistro=configuracion.permitirRegistro;
    })
  }

  logout(){
    // Mostrar el loader
    this.loaderService.showLoader();

    this.loginService.logout();
    this.isLoggedIn=false;
    
    // Ocultar el loader
    this.loaderService.hideLoader();
    this.router.navigate(['/login']);
  }

}
