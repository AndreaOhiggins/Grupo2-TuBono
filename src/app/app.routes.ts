import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './bond/pages/home/home.component';
import { BondFormComponent } from './bond/components/bond-form/bond-form.component';
import { BondTableComponent } from './bond/components/bond-table/bond-table.component';
import { ProfileComponent } from './profile/profile.component';
import { BondDetailComponent } from './bond/components/bond-detail/bond-detail.component';
import { BondPurchasesComponent } from './bond/components/bond-purchases/bond-purchases.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent,
        children:[
            {path: '', redirectTo: 'bond-table', pathMatch: 'full'},
            {path:'bond-table', component: BondTableComponent},
            {path: 'bond-form', component: BondFormComponent},
            {path: 'bond-form/edit/:bondId', component: BondFormComponent},
            {path: 'bond-form/create', component: BondFormComponent},
            {path: 'bond-detail/:bondId', component: BondDetailComponent},
            {path: 'bond-purchases', component: BondPurchasesComponent}
        ]
    },
    {path: 'profile', component:ProfileComponent}
];
