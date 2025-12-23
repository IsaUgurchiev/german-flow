import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError, of } from 'rxjs';

export interface User {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'gf_auth_token';
  private readonly USER_KEY = 'gf_user_data';

  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  isAuthenticated = signal<boolean>(!!this.token());

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  me() {
    return this.http.get<User>(`${environment.apiBaseUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }

  initializeGoogleLogin(element: HTMLElement) {
    if (typeof (window as any).google === 'undefined') {
      setTimeout(() => this.initializeGoogleLogin(element), 100);
      return;
    }

    (window as any).google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleResponse(response)
    });

    (window as any).google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'medium',
      type: 'standard',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left'
    });
  }

  private handleGoogleResponse(response: any) {
    this.loginWithGoogle(response.credential).subscribe({
      next: () => {
        // Handle success
      },
      error: (err) => console.error('Auth error:', err)
    });
  }

  loginWithGoogle(idToken: string) {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/google`, { idToken }).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    if (typeof (window as any).google !== 'undefined') {
      (window as any).google.accounts.id.disableAutoSelect();
    }
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, authResult.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.token.set(authResult.accessToken);
    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}

