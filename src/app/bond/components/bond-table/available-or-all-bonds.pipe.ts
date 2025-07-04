import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'availableOrAllBonds',
  standalone: true
})
export class AvailableOrAllBondsPipe implements PipeTransform {
  transform(bonds: any[], role: string): any[] {
    if (!Array.isArray(bonds)) return [];
    if (role === 'INVESTOR') {
      return bonds.filter(bond => bond.state === 'AVAILABLE');
    }
    // For issuers or other roles, return all bonds
    return bonds;
  }
}
