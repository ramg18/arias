import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://blog.ariasyasociados.co/api/login';
  private readonly TOKEN_KEY = 'arias_auth_token';
  private readonly USER_KEY = 'arias_auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  private loadSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveSession(response);
        }
      })
    );
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    
    this.currentUserSubject.next(response.user);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
