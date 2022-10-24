import { LoginService } from './../../servicios/login-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})
export class CabeceroComponent implements OnInit {
  mostrarREsponsive_menu = false;//creo esta variable para desplegar menu

  isLoggedIn:boolean;
  loggedInUser:string;

  constructor(private loginService:LoginService,
              private router:Router) { }

  ngOnInit(): void {
  this.loginService.getAuth().subscribe(auth =>{
    if(auth){
      this.isLoggedIn=true;
      this.loggedInUser=auth.email;
    }
    else
    this.isLoggedIn=false;
  });
  }

  logout(){
    this.loginService.logout();
    this.isLoggedIn=false;
    this.router.navigate(['/login']);
  }

}
