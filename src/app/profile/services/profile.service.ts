import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  base_URL = "https://3364-38-25-18-19.ngrok-free.app/api/v1";

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
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

  getUserById(id : any): Observable<any> {
    return this.http.get<any>(`${this.base_URL}/user/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateUser(id: any, user: any): Observable<any> {
    return this.http.put<any>(`${this.base_URL}/user/${id}`, JSON.stringify(user), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.base_URL}/user/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }


}
