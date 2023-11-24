import { Component } from '@angular/core';
import { SidebarService } from './servicios/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSidebarOpen: boolean = false;
  title = 'corralon';

  constructor(private sidebarService: SidebarService) { }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
