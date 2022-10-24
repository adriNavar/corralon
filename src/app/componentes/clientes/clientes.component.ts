import { FlashMessage } from 'angular2-flash-messages/module/flash-message';

import { ClienteServicio } from './../../servicios/cliente.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/modelos/cliente.model';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  cliente:Cliente={
    nombre:'' ,
    apellido: '',
    email:'' ,
    saldo:0
  }
  @ViewChild("clienteForm") clienteForm:NgForm; //clienteForm esta definido en el html, se hace para recuperar los datos del formulario y asi poder limpiar la ventana modal
  @ViewChild("botonCerrar") botonCerrar:ElementRef;// cerrar ventana modal
  @ViewChild("botonLimpiar") botonLimpiar:ElementRef;

  constructor(private clienteServicio: ClienteServicio,
              private flashMessage:FlashMessagesService) { }

  ngOnInit(): void {
    this.clienteServicio.getClientes().subscribe(
      clientes=> {
        this.clientes= clientes;
      })
  }

  getSaldoTotal(){
    let saldoTotal:number=0;
    if(this.clientes){
      this.clientes.forEach(cliente =>{
        saldoTotal+=cliente.saldo;
      })

    }
    return saldoTotal;
  }

  agregar({value,valid}:{value:Cliente,valid:boolean}){
    if(!valid){
      this.flashMessage.show('Por favor completar el formulario correctamente',{
        cssClass:'alert-danger',timeout: 4000 // tiempo en el que se ve el componente
      });
    }
    else{
      //Agregar el nuevo componente
      this.clienteServicio.agregarCliente(value)
      this.clienteForm.resetForm();// aca se limpia el formulario
      this.cerrarModal();
    }
  }
    cerrarModal(){
      this.botonCerrar.nativeElement.click();
    }

    limpiar(){
      this.botonLimpiar.nativeElement.click();
    }
    resetForm() {
      this.clienteForm.resetForm();
      this.cerrarModal();
    }

}
