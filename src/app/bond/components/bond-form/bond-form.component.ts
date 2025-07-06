import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BondService } from '../../services/bond.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bond-form',
  imports: [CommonModule, FormsModule],
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
  showToast = false;
  toastTimeout: any;
  tipoTasaValue: string = '';
  capitalizacionValue: string = '';
  
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
    // Mostrar toast si está en localStorage (persistente entre pantallas)
    if (localStorage.getItem('showToast') === 'true') {
      this.showToast = true;
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      this.toastTimeout = setTimeout(() => {
        this.showToast = false;
        localStorage.removeItem('showToast');
      }, 3000);
    }

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
        // Set values to form fields for editing
        setTimeout(() => {
          // Solo asignar si el elemento existe en el DOM
          const setValue = (id: string, value: string) => {
            const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
            if (el) el.value = value;
          };
          setValue('nombre', this.bondData.name || '');
          setValue('valorNominal', this.bondData.nominalValue != null ? this.bondData.nominalValue.toString() : '');
          setValue('valorComercial', this.bondData.commercialValue != null ? this.bondData.commercialValue.toString() : '');
          setValue('tasaInteres', this.bondData.interestRate != null ? this.bondData.interestRate.toString() : '');
          setValue('periodo', this.bondData.interestRateFrequency != null ? this.bondData.interestRateFrequency.toString() : '');
          setValue('tipoTasa', this.bondData.interestRateType || '');
          this.tipoTasaValue = this.bondData.interestRateType || '';
          if (this.bondData.interestRateType === 'NOMINAL') {
            setValue('capitalizacion', this.bondData.interestRateCapitalizationFrequency != null ? this.bondData.interestRateCapitalizationFrequency.toString() : '');
            this.capitalizacionValue = this.bondData.interestRateCapitalizationFrequency != null ? this.bondData.interestRateCapitalizationFrequency.toString() : '';
          } else {
            this.capitalizacionValue = '';
          }
          setValue('tipoMoneda', this.bondData.currency || '');
          setValue('plazoPago', this.bondData.paymentPeriod != null ? this.bondData.paymentPeriod.toString() : '');
          setValue('frecuenciaPago', this.bondData.paymentFrequency != null ? this.bondData.paymentFrequency.toString() : '');
          setValue('prima', this.bondData.redemptionPremium != null ? this.bondData.redemptionPremium.toString() : '');
          setValue('cok', this.bondData.cok != null ? this.bondData.cok.toString() : '');
          setValue('cokFrecuencia', this.bondData.cokFrequency != null ? this.bondData.cokFrequency.toString() : '');
          setValue('tipoPeriodoGracia', this.bondData.gracePeriodType || '');
          setValue('periodoGracia', this.bondData.gracePeriods != null ? this.bondData.gracePeriods.toString() : '0');
          setValue('estructuracion', this.bondData.structuringCost != null ? this.bondData.structuringCost.toString() : '');
          setValue('colocación', this.bondData.placementCost != null ? this.bondData.placementCost.toString() : '');
          setValue('flotacion', this.bondData.flotationCost != null ? this.bondData.flotationCost.toString() : '');
          setValue('cavali', this.bondData.cavaliCost != null ? this.bondData.cavaliCost.toString() : '');
        }, 0);
      },
      error: (error) => {
        console.error('Error fetching bond:', error);
      }
    });
  }


  create() {
    // Obtener valores de periodo de gracia
    const periodoGraciaValue = (document.getElementById('periodoGracia') as HTMLSelectElement)?.value;
    const tipoPeriodoGracia = (document.getElementById('tipoPeriodoGracia') as HTMLSelectElement)?.value || '';
    let gracePeriods = 0;
    if (periodoGraciaValue && !isNaN(Number(periodoGraciaValue))) {
      gracePeriods = Number(periodoGraciaValue);
    }

    // Usar los valores de ngModel si existen
    const tipoTasa = this.tipoTasaValue || ((document.getElementById('tipoTasa') as HTMLSelectElement)?.value || '').toUpperCase();
    let capitalizacion = '';
    if (tipoTasa === 'NOMINAL') {
      capitalizacion = this.capitalizacionValue || (document.getElementById('capitalizacion') as HTMLSelectElement)?.value || '';
    }

    const newBond = {
      name: (document.getElementById('nombre') as HTMLInputElement)?.value || '',
      nominalValue: Number((document.getElementById('valorNominal') as HTMLInputElement)?.value) || 0,
      commercialValue: Number((document.getElementById('valorComercial') as HTMLInputElement)?.value) || 0,
      interestRate: Number((document.getElementById('tasaInteres') as HTMLInputElement)?.value) || 0,
      interestRateFrequency: Number((document.getElementById('periodo') as HTMLInputElement)?.value) || 0,
      interestRateType: tipoTasa,
      interestRateCapitalizationFrequency: tipoTasa === 'NOMINAL' ? (Number(capitalizacion) || 0) : 0,
      currency: ((document.getElementById('tipoMoneda') as HTMLSelectElement)?.value || '').toUpperCase(),
      paymentPeriod: Number((document.getElementById('plazoPago') as HTMLInputElement)?.value) || 0,
      paymentFrequency: Number((document.getElementById('frecuenciaPago') as HTMLSelectElement)?.value || ''),
      redemptionPremium: Number((document.getElementById('prima') as HTMLInputElement)?.value) || 0,
      cok: Number((document.getElementById('cok') as HTMLInputElement)?.value) || 0,
      cokFrequency: Number((document.getElementById('cokFrecuencia') as HTMLSelectElement)?.value) || 0,
      gracePeriodType: gracePeriods === 0 ? 'NONE' : tipoPeriodoGracia,
      gracePeriods: gracePeriods,
      structuringCost: Number((document.getElementById('estructuracion') as HTMLInputElement)?.value) || 0,
      placementCost: Number((document.getElementById('colocación') as HTMLInputElement)?.value) || 0,
      flotationCost: Number((document.getElementById('flotacion') as HTMLInputElement)?.value) || 0,
      cavaliCost: Number((document.getElementById('cavali') as HTMLInputElement)?.value) || 0
    }
    console.log('New Bond Data:', newBond);

    this.showToast = true;
    
    this.bondService.createBond(this.userId ?? 0, newBond).subscribe({
      next: (response) => {
        console.log('Bond created successfully:', response);
        this.showToast = true;
        localStorage.setItem('showToast', 'true');
        if (this.toastTimeout) {
          clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => {
          this.showToast = false;
          localStorage.removeItem('showToast');
        }, 3000);
        // Optionally, puedes navegar a otra página aquí
      },
      error: (error) => {
        console.error('Error creating bond:', error);
      }
    });
  }

  update() {
    // Obtener valores de periodo de gracia
    const periodoGraciaValue = (document.getElementById('periodoGracia') as HTMLSelectElement)?.value;
    const tipoPeriodoGracia = (document.getElementById('tipoPeriodoGracia') as HTMLSelectElement)?.value || '';
    let gracePeriods = 0;
    if (periodoGraciaValue && !isNaN(Number(periodoGraciaValue))) {
      gracePeriods = Number(periodoGraciaValue);
    }

    // Usar los valores de ngModel si existen
    const tipoTasa = this.tipoTasaValue || ((document.getElementById('tipoTasa') as HTMLSelectElement)?.value || '').toUpperCase();
    let capitalizacion = '';
    if (tipoTasa === 'NOMINAL') {
      capitalizacion = this.capitalizacionValue || (document.getElementById('capitalizacion') as HTMLSelectElement)?.value || '';
    }

    const newBond = {
      name: (document.getElementById('nombre') as HTMLInputElement)?.value || '',
      nominalValue: Number((document.getElementById('valorNominal') as HTMLInputElement)?.value) || 0,
      commercialValue: Number((document.getElementById('valorComercial') as HTMLInputElement)?.value) || 0,
      interestRate: Number((document.getElementById('tasaInteres') as HTMLInputElement)?.value) || 0,
      interestRateFrequency: Number((document.getElementById('periodo') as HTMLInputElement)?.value) || 0,
      interestRateType: tipoTasa,
      interestRateCapitalizationFrequency: tipoTasa === 'NOMINAL' ? (Number(capitalizacion) || 0) : 0,
      currency: ((document.getElementById('tipoMoneda') as HTMLSelectElement)?.value || '').toUpperCase(),
      paymentPeriod: Number((document.getElementById('plazoPago') as HTMLInputElement)?.value) || 0,
      paymentFrequency: Number((document.getElementById('frecuenciaPago') as HTMLSelectElement)?.value || ''),
      redemptionPremium: Number((document.getElementById('prima') as HTMLInputElement)?.value) || 0,
      cok: Number((document.getElementById('cok') as HTMLInputElement)?.value) || 0,
      cokFrequency: Number((document.getElementById('cokFrecuencia') as HTMLSelectElement)?.value) || 0,
      gracePeriodType: gracePeriods === 0 ? 'NONE' : tipoPeriodoGracia,
      gracePeriods: gracePeriods,
      structuringCost: Number((document.getElementById('estructuracion') as HTMLInputElement)?.value) || 0,
      placementCost: Number((document.getElementById('colocación') as HTMLInputElement)?.value) || 0,
      flotationCost: Number((document.getElementById('flotacion') as HTMLInputElement)?.value) || 0,
      cavaliCost: Number((document.getElementById('cavali') as HTMLInputElement)?.value) || 0
    }
    // Validar que currency no sea string vacío
    if (!newBond.currency) {
      newBond.currency = 'SOLES';
    }
    console.log('New Bond Data:', newBond);

    this.showToast = true;
    
    this.bondService.updateBond(this.bondId, newBond).subscribe({
      next: (response) => {
        console.log('Bond updated successfully:', response);
        this.showToast = true;
        localStorage.setItem('showToast', 'true');
        if (this.toastTimeout) {
          clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => {
          this.showToast = false;
          localStorage.removeItem('showToast');
        }, 3000);
        // Optionally, puedes navegar a otra página aquí
      },
      error: (error) => {
        console.error('Error updating bond:', error);
      }
    });
  }

  // Método para manejar el cambio de tipo de tasa
  onTipoTasaChange() {
    if (this.tipoTasaValue === 'EFFECTIVE') {
      this.capitalizacionValue = '';
    }
  }

}
