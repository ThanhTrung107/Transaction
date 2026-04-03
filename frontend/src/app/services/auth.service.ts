import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  role: string;
  message: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
}

export interface ErrorResponse {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERNAME_KEY = 'username';
  private readonly ROLE_KEY = 'userRole';
  private apiUrl = 'http://localhost:8080/auth';
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const username = localStorage.getItem(this.USERNAME_KEY);
    const role = localStorage.getItem(this.ROLE_KEY);
    if (username && role) {
      this.currentUser = { username, role: role as 'admin' | 'user' };
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          const normalizedRole = response.role.toLowerCase() as 'admin' | 'user';
          this.currentUser = {
            username: response.username,
            role: normalizedRole
          };
          localStorage.setItem(this.USERNAME_KEY, response.username);
          localStorage.setItem(this.ROLE_KEY, normalizedRole);
        })
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getRole(): 'admin' | 'user' | null {
    return this.currentUser?.role ?? null;
  }

  getUsername(): string | null {
    return this.currentUser?.username ?? null;
  }
}
