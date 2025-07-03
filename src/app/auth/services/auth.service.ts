import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  base_URL = "https://3364-38-25-18-19.ngrok-free.app/api/v1";

  constructor(private http: HttpClient) { }

  private userIdSignal = signal<number | null>(null); 
  private userDataSignal = signal<any>(null);

  // userDataSignal
  getUserData() {
    return this.userDataSignal();
  }
  setUserData(data: any) {
    this.userDataSignal.set(data);
    localStorage.setItem('userData', JSON.stringify(data));
  }
  restoreUserData() {
    const stored = localStorage.getItem('userData');
    if (stored) {
      this.userDataSignal.set(JSON.parse(stored));
    }
  }
  clearUserData() {
    this.userDataSignal.set(null);
    localStorage.removeItem('userData');
  }
  userData = this.userDataSignal.asReadonly();

  // userIdSignal
  getUserId() {
    return this.userIdSignal();
  }
  setUserId(id: number) {
    this.userIdSignal.set(id);
    localStorage.setItem('userId', id.toString());
  }
  restoreSession() {
    const stored = localStorage.getItem('userId');
    if (stored) {
      this.userIdSignal.set(Number(stored));
    }
  }
  logout() {
    this.userIdSignal.set(null);
    localStorage.removeItem('userId');
  }
  userId = this.userIdSignal.asReadonly();

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

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.base_URL}/users/register`, JSON.stringify(user), this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  loginUser(email: any, password: any): Observable<any> {
    return this.http.post<any>(`${this.base_URL}/users/login?email=${email}&password=${password}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  
}
