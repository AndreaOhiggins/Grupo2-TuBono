import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BondService {

  base_URL = "http://localhost:8080/api/v1";

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error ocurred ${error.status}, body was: ${error.error}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  createBond(bond: any): Observable<any> {
    return this.http.post<any>(`${this.base_URL}/corporate-bond`, JSON.stringify(bond), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // /corporate-bond/{id}
  getBondById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/corporate-bond/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // /corporate-bonds/user/{userId}
  getBondsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/corporate-bonds/user/${userId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // /corporate-bond/{id}
  updateBond(id: number, bond: any): Observable<any> {
    return this.http.put<any>(`${this.base_URL}/corporate-bond/${id}`, JSON.stringify(bond), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // /corporate-bond/{id}
  deleteBond(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base_URL}/corporate-bond/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // /cashflow/{corporateBondId}
  getCashFlowByBondId(bondId: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/cash-flow/${bondId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // /period-details/{cashFlowId}
  getAllPeriodDetailsByCashFlowId(cashFlowId: number): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/period-details/${cashFlowId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
