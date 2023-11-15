import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { map } from "rxjs";

@Injectable()
export class LoginService{
  constructor(private authService:AngularFireAuth){
}

  login(email:string,password:string){
    return new Promise((resolve,rejet)=>{
      this.authService.signInWithEmailAndPassword(email,password)
      .then(datos=>resolve(datos),
      error=> rejet(error)
    )
    })
  }

  getAuth(){
    return this.authService.authState.pipe( // con esto traemos el usuario que se logeo
      map(auth => auth)
    );
  }
  logout(){
    this.authService.signOut();
  }

  registrarse(email:string,password:string){
    return new Promise((resolve,rejet)=>{
      this.authService.createUserWithEmailAndPassword(email,password)
      .then(datos=>resolve(datos),
      error=> rejet(error)
    )
    })

  }
}
