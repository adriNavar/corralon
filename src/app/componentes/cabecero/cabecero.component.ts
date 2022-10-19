import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})
export class CabeceroComponent implements OnInit {
  mostrarREsponsive_menu = false;//creo esta variable para desplegar menu
  constructor() { }

  ngOnInit(): void {
  }

}
