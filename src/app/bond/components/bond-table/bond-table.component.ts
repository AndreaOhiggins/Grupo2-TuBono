import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BondService } from '../../services/bond.service';
import { AvailableOrAllBondsPipe } from './available-or-all-bonds.pipe';

@Component({
  selector: 'app-bond-table',
  imports: [
    NgFor,
    CommonModule,
    AvailableOrAllBondsPipe
  ],
  templateUrl: './bond-table.component.html',
  styleUrl: './bond-table.component.css'
})
export class BondTableComponent implements OnInit {

  private authService = inject(AuthService);
  userId = computed(() => this.authService.userId());
  userData = this.authService.getUserData();

  displayedColumns: string[] = ['name', 'issueDate', 'nominalValue', 'TCEA', 'TREA'];
  dataSource: any[] = []; 

  showSuccessModal = false;

  constructor(private router: Router, private bondService: BondService) {
    
  }

  ngOnInit(): void {
    this.authService.restoreSession();
    setTimeout(() => {
      const uid = this.authService.getUserId();
      const role = this.userData?.role;
      if (uid !== null && uid !== undefined) {
        if (role === 'ISSUER') {
          this.getAllBondsByUserId();
        } else if (role === 'INVESTOR') {
          this.getAllBonds();
        }
      } else {
        console.error('No user ID found in session.');
      }
    }, 100);
  }

  // for issuers
  getAllBondsByUserId() {
    const userId = this.userId();
    if (userId !== null && userId !== undefined) {
      this.bondService.getBondsByUserId(userId).subscribe({
        next: (response) => {
          this.dataSource = response;

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

  // for investors
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

  addCashFlowForEachBond() {

    // for each bond, add a cash flow
    if (!this.dataSource || this.dataSource.length === 0) {
      // if bonds are not loaded yet, wait a bit and try again
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

  getCashFlow(bondId: any) {
    this.bondService.getBondById(bondId).subscribe({
      next: (response) => {
        return response;
      },
      error: (error) => {
        console.error('Error fetching cash flows for bond:', error);
      }
    });
  }

  buyBond(bondId: number) {
    console.log('Buying bond with ID:', bondId);
    this.showSuccessModal = true;
    var purchasedState = {
      bondState: 'PURCHASED',
      userInvestorId: this.userId()
    };
    // update investor who bought the bond
    const investorId = this.userId();
    if (investorId !== null && investorId !== undefined) {
      this.bondService.updateBondStateAndInvertorId(bondId, purchasedState).subscribe({
        next: (response) => {
          console.log('Bond investor ID updated successfully:', response);
          this.getAllBonds();

        },
        error: (error) => {
          console.error('Error updating bond investor ID:', error);
        }
      });
    }
  }

  // Navigation methods
  goToNewBond() {
    this.router.navigate(['/home/bond-form']);
  }

  goToEditBond(bondId: number) {
    this.router.navigate(['/home/bond-form/edit', bondId]);
  }

  goToBondDetail(bondId: number) {
    this.router.navigate(['/home/bond-detail', bondId]);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  // Pagination properties
  currentPage = 1;
  totalPages = 3; 
  previousPage() {
  }

  nextPage() {

  }
}
