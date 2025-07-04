import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'purchasedBonds',
  standalone: true
})
export class PurchasedBondsPipe implements PipeTransform {
  transform(bonds: any[], userInvestorId?: number, role?: string): any[] {
    if (!Array.isArray(bonds)) return [];

    // filter bonds if they are purchased
    let filtered = bonds.filter(bond => bond.state === 'PURCHASED');

    // filter if user is an INVESTOR and has a userInvestorId
    if (role === 'INVESTOR' && userInvestorId != null) {
      filtered = filtered.filter(bond => bond.userInvestorId === userInvestorId);
    }
    return filtered;
  }
}
