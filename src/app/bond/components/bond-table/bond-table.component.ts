import { Component, computed, inject, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BondService } from '../../services/bond.service';

@Component({
  selector: 'app-bond-table',
  imports: [
    NgFor
  ],
  templateUrl: './bond-table.component.html',
  styleUrl: './bond-table.component.css'
})
export class BondTableComponent implements OnInit {

  private auth = inject(AuthService);
  userId = computed(() => this.auth.userId());

  bonds = [
    { name: 'Bond 1', issueDate: '01-01-2025', nominalValue: 1000, TCEA: 5.0, TREA: 4.5 },
    { name: 'Bond 2', issueDate: '01-01-2025', nominalValue: 2000, TCEA: 6.0, TREA: 5.5 },
    { name: 'Bond 3', issueDate: '01-01-2025', nominalValue: 1500, TCEA: 4.5, TREA: 4.0 }
  ];

  displayedColumns: string[] = ['name', 'issueDate', 'nominalValue', 'TCEA', 'TREA'];
  // dataSource = this.bonds;
  dataSource: any[] = []; // Initialize as an empty array

  constructor(private router: Router, private bondService: BondService) {
    
  }

  ngOnInit(): void {
    if (!this.auth.userId()) {
      this.auth.restoreSession(); // En caso aún no se haya llamado
    }
    this.getAllBondsByUserId();
  }

  getAllBondsByUserId() {
    const userId = this.userId();
    if (userId !== null && userId !== undefined) {
      this.bondService.getBondsByUserId(userId).subscribe({
        next: (response) => {
          this.dataSource = response;
          console.log('Bonds fetched successfully:', this.dataSource);
        },
        error: (error) => {
          console.error('Error fetching bonds:', error);
        }
      });
    } else {
      console.error('User ID is null or undefined. Cannot fetch bonds.');
    }
  }

  goToNewBond() {
    this.router.navigate(['/home/bond-form']);
  }

  goToEditBond(bondId: number) {
    this.router.navigate(['/home/bond-form/edit', bondId]);
  }

  goToBondDetail(bondId: number) {
    this.router.navigate(['/home/bond-detail', bondId]);
  }

  currentPage = 1;
  totalPages = 3; 
  previousPage() {
  }

  nextPage() {

  }
}
