import { Component, OnInit } from '@angular/core';
import { BondService } from '../../services/bond.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-bond-detail',
  imports: [
    NgFor,
    CommonModule
  ],
  templateUrl: './bond-detail.component.html',
  styleUrl: './bond-detail.component.css'
})
export class BondDetailComponent implements OnInit {

  periodDetails: any[] = [];
  cashFlow: any;
  bondData: any;
  bondId: any;
  constructor(private route: ActivatedRoute, private bondService: BondService) {
    this.route.paramMap.subscribe(params => {
        this.bondId = params.get('bondId');
        console.log('Bond ID:', this.bondId);
      });
  }

  ngOnInit(): void {
    this.getBondById();
    this.getCashFlow();
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

  getCashFlow() {
    //obtain the cash flow of the bond
    this.bondService.getCashFlowByBondId(this.bondId).subscribe({
      next: (response) => {
        this.cashFlow = response;
        console.log('Cash flow fetched successfully:', response);
        // You can now use the response to populate your cash flow details
        this.getPeriodDetailsByCashFlowId(response.id);
      },
      error: (error) => {
        console.error('Error fetching cash flow:', error);
      }
    });
  }

  getPeriodDetailsByCashFlowId(cashFlowId: number) {
    //obtain the period details of the cash flow
    this.bondService.getAllPeriodDetailsByCashFlowId(cashFlowId).subscribe({
      next: (response) => {
        console.log('Period details fetched successfully:', response);
        this.periodDetails = response;
      },
      error: (error) => {
        console.error('Error fetching period details:', error);
      }
    });
  }

  goToBondTable() {
    // Navigate back to the bond table
    window.history.back();
  }
}
