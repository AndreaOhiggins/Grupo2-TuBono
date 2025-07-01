import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {MatIconModule} from '@angular/material/icon';
// import {MatButtonModule} from '@angular/material/button';
// import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [
    // MatToolbarModule, 
    // MatButtonModule, 
    // MatIconModule
     CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  sidebarOpen = false;

   toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
