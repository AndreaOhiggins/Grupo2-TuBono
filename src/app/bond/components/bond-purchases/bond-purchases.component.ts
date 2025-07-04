import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { BondService } from '../../services/bond.service';
import { CommonModule, NgFor } from '@angular/common';
import { PurchasedBondsPipe } from './purchased-bonds.pipe';

@Component({
  selector: 'app-bond-purchases',
  imports: [
    NgFor,
    CommonModule,
    PurchasedBondsPipe
  ],
  templateUrl: './bond-purchases.component.html',
  styleUrl: './bond-purchases.component.css'
})
export class BondPurchasesComponent {

  private authService = inject(AuthService);
  userId = computed(() => this.authService.userId());
  userData = this.authService.getUserData();

  displayedColumns: string[] = ['name', 'issueDate', 'nominalValue', 'TCEA', 'TREA'];
  dataSource: any[] = []; 

  constructor(private router: Router, private bondService: BondService) {
    
  }
  
  ngOnInit(): void {
    this.authService.restoreSession();
    setTimeout(() => {
      const uid = this.authService.getUserId();
      const role = this.userData?.role;
      if (uid !== null && uid !== undefined) {
        if (role === 'INVESTOR') {
          this.getAllBonds();
        } else {
          this.getAllBondsByUserId();
        }
      } else {
        console.error('No user ID found in session.');
      }
    }, 100);
  }

  getAllBonds() {
    this.bondService.getAllBonds().subscribe({
      next: (response) => {
        this.dataSource = response;
        this.addCashFlowForEachBond();
      },
      error: (error) => {
        console.error('Error fetching all bonds:', error);
      }
    });
  }

  getAllBondsByUserId() {
    const userId = this.userId();
    if (userId !== null && userId !== undefined) {
      this.bondService.getBondsByUserId(userId).subscribe({
        next: (response) => {
          this.dataSource = response;

          // add cash flow for each bond
          this.addCashFlowForEachBond();
        },
        error: (error) => {
          console.error('Error fetching bonds:', error);
        }
      });
    } else {
      console.error('User ID is null or undefined. Cannot fetch bonds.');
    }
  }

  addCashFlowForEachBond() {

    // for each bond, add a cash flow
    if (!this.dataSource || this.dataSource.length === 0) {
      // if the bonds are not loaded yet, wait a bit and try again
      setTimeout(() => this.addCashFlowForEachBond(), 300);
      return;
    }

    this.dataSource.forEach(bond => {
      this.bondService.getCashFlowByBondId(bond.id).subscribe({
      next: (response) => {
        bond.cashFlow = response.cashFlow || response;
      },
      error: (error) => {
        console.error('Error fetching cash flows for bond:', error);
      }
      });
    });
  }

  // Navigation method
  goToBondDetail(bondId: number) {
    this.router.navigate(['/home/bond-detail', bondId]);
  }

  // Pagination properties
  currentPage = 1;
  totalPages = 3; 
  previousPage() {
  }

  nextPage() {

  }

}
