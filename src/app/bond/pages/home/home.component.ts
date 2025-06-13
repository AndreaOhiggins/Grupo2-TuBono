import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    NgFor
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  bonds = [
    { name: 'Bond 1', issueDate: '2023-01-01', maturityDate: '2025-01-01', TCEA: 5.0, TREA: 4.5, amount: 1000 },
    { name: 'Bond 2', issueDate: '2023-02-01', maturityDate: '2026-02-01', TCEA: 6.0, TREA: 5.5, amount: 2000 },
    { name: 'Bond 3', issueDate: '2023-03-01', maturityDate: '2027-03-01', TCEA: 4.5, TREA: 4.0, amount: 1500 }
  ];

  displayedColumns: string[] = ['name', 'issueDate', 'maturityDate', 'TCEA', 'TREA', 'amount'];
  dataSource = this.bonds;

  constructor(private router: Router) {
    
  }

  goToNewBond() {
    this.router.navigate(['/new-bond']);
  }

  currentPage = 1;
  totalPages = 3; 
  previousPage() {
  }

  nextPage() {

  }

}
