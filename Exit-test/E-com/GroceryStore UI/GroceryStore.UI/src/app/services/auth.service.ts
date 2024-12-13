import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'currentUser';
  baseApiUrl: string = environment.baseApiUrl;

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(this.baseApiUrl + 'api/Users/register', user);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(this.baseApiUrl + 'api/Users/login', loginData);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedInSubject.next(false);
  }

  checkLoggedInStatus() {
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }  

  getCurrentUser(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
