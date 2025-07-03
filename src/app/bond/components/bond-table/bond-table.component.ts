import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BondService } from '../../services/bond.service';
import { ProfileService } from '../../../profile/services/profile.service';

@Component({
  selector: 'app-bond-table',
  imports: [
    NgFor,
    CommonModule
  ],
  templateUrl: './bond-table.component.html',
  styleUrl: './bond-table.component.css'
})
export class BondTableComponent implements OnInit {

  private authService = inject(AuthService);
  private profileService = inject(ProfileService)
  userId = computed(() => this.authService.userId());
  userData = this.authService.getUserData();

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

  // ngOnInit(): void {
  //   if (!this.authService.userId()) {
  //     this.authService.restoreSession();
  //   }
  //   this.getUserById();
  //   this.getAllBondsByUserId();
  //   console.log('Llamando a getAllBondsByUserId()');
  //   this.addCashFlowForEachBond();
  // }

  // ngOnInit(): void {
  //   this.authService.restoreSession(); // <-- asegurar sesión al cargar
  //   console.log("restore session " + this.userData);
  //   this.getAllBondsByUserId();
  // }

  ngOnInit(): void {
    this.authService.restoreSession();

    setTimeout(() => {
      const uid = this.authService.getUserId();
      console.log('UserId restored:', uid);
      if (uid !== null && uid !== undefined) {
        this.getAllBondsByUserId();
      } else {
        console.error('No user ID found in session.');
      }
    }, 100); // espera leve para asegurar que el localStorage haya sido leído
  }

  getAllBondsByUserId() {
    console.log('User ID en Angular:', this.userId());

    const userId = this.userId();
    if (userId !== null && userId !== undefined) {
      this.bondService.getBondsByUserId(userId).subscribe({
        next: (response) => {
          this.dataSource = response;
          console.log('Bonds fetched successfully:', this.dataSource);

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

    console.log('Adding cash flow for each bond...');

    // para cada bono, agregar un flujo de caja
    // Espera a que los bonos estén cargados antes de intentar agregar el flujo de caja
    if (!this.dataSource || this.dataSource.length === 0) {
      // Si los bonos aún no están cargados, espera un poco y vuelve a intentar
      setTimeout(() => this.addCashFlowForEachBond(), 300);
      return;
    }

    this.dataSource.forEach(bond => {
      this.bondService.getCashFlowByBondId(bond.id).subscribe({
      next: (response) => {
        bond.cashFlow = response.cashFlow || response; // Ajusta según la estructura de la respuesta
        console.log('Cash flow added for bond:', bond.id);
        console.log('Bond modified:', bond);
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
