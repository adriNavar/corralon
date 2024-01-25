// app-sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.css']
})
export class AppSidebarComponent implements OnInit {
  isSidebarOpen: boolean = false;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
    console.log('hola');
  }

  // Otros métodos o propiedades según sea necesario
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}

