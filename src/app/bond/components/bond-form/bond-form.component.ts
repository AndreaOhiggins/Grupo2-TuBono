import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BondService } from '../../services/bond.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-bond-form',
  imports: [],
  templateUrl: './bond-form.component.html',
  styleUrl: './bond-form.component.css'
})
export class BondFormComponent implements OnInit {

  
  isEditMode: boolean = false;
  bondId: any;
  bondData: any;
  private authService = inject(AuthService);
  userId = this.authService.getUserId();
  userData = this.authService.getUserData();
  
  constructor(private route: ActivatedRoute, private bondService: BondService) {

    // Check if the route contains a bondId parameter to determine if it's in edit mode
    this.isEditMode = this.route.snapshot.paramMap.has('bondId');
    console.log('Is Edit Mode:', this.isEditMode);
    
    // If in edit mode, get the bondId from the route parameters
    if (this.isEditMode) {
      this.route.paramMap.subscribe(params => {
        this.bondId = params.get('bondId');
        console.log('Bond ID:', this.bondId);
      });
    }
  }


  ngOnInit(): void {
    this.authService.restoreSession();

    // If in edit mode, fetch the bond data by ID
    if (this.isEditMode && this.bondId) {
      console.log('Fetching bond data for ID:', this.bondId);
      this.getBondById();
    }
    
  }

  getBondById() {
    this.bondService.getBondById(this.bondId).subscribe({
      next: (response) => {
        this.bondData = response;
        console.log('Bond fetched successfully:', response);
        // You can now use the response to populate your form fields
      },
      error: (error) => {
        console.error('Error fetching bond:', error);
      }
    });
  }

}
