import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(username: string, password: string): boolean {
    const role = (username === 'admin' && password === 'admin') ? 'admin' : 'user';
    
    this.currentUser = { username, role };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    
    return true;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
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
}
