import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { ProfileService } from '../../profile/services/profile.service';

@Component({
  selector: 'app-header',
  imports: [
     CommonModule,
     RouterLink
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

  sidebarOpen = false;

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidebarOpen = false;
      }
    });
  }

  ngOnInit(): void {
    console.log('HeaderComponent initialized');
    console.log('User data from header:', this.userData);
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

   toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
