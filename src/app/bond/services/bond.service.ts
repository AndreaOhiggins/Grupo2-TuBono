import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BondService {

  // base_URL = "https://3364-38-25-18-19.ngrok-free.app/api/v1";
  base_URL = "http://localhost:8080/api/v1";

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    })
  }
  

  // handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     console.log(`An error ocurred ${error.status}, body was: ${error.error}`);
  //   } else {
  //     console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
  //   }
  //   return throwError(() => new Error('Something bad happened; please try again later.'));
  // }

  handleError(error: HttpErrorResponse) {
    console.error('Full error object:', error);
    alert('Error del servidor: ' + JSON.stringify(error.error));
    return throwError(() => new Error('Ocurrió un error. Inténtalo nuevamente.'));
  }


  createBond(userId: number, bond: any): Observable<any> {
    return this.http.post<any>(`${this.base_URL}/corporate-bond?userId=${userId}`, JSON.stringify(bond), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }


  getBondById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/corporate-bond/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAllBonds(): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/corporate-bonds`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getBondsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/corporate-bonds/user/${userId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getBondsByInvestorId(investorId: number): Observable<any> {
    console.log(`Fetching bonds for investor ID: ${investorId}`);
    return this.http.get<any>(`${this.base_URL}/corporate-bonds/investor/${investorId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateBond(id: number, bond: any): Observable<any> {
    return this.http.put<any>(`${this.base_URL}/corporate-bond/${id}`, JSON.stringify(bond), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateBondState(id: number, state: any): Observable<any> {
    return this.http.patch<any>(`${this.base_URL}/corporate-bond/${id}/state`, JSON.stringify(state), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateBondStateAndInvertorId(id: number, stateAndInvestorId: any): Observable<any> {
    return this.http.patch<any>(`${this.base_URL}/corporate-bond/${id}/investor`, JSON.stringify(stateAndInvestorId), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  deleteBond(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base_URL}/corporate-bond/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getCashFlowByBondId(bondId: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/cash-flow/${bondId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAllPeriodDetailsByCashFlowId(cashFlowId: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/period-details/${cashFlowId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
