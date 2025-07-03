import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile/services/profile.service';
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
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  userId = this.authService.getUserId();
  userData= this.authService.getUserData();

  constructor() {
    
  }

  ngOnInit(): void {
    console.log('HeaderComponent initialized');
    console.log('User data from header:', this.userData);
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  sidebarOpen = false;

   toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
