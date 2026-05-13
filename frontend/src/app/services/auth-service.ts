import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '@app/types/user';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

export type LoginApiResponse =
  | {
      status: 1;
      message: string;
    }
  | { status: 2; user: User };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);

  private _user = signal<User | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(true);

  private baseUrl = `${environment.apiUrl}/auth`;

  user = this._user.asReadonly();
  isLoading = this._isLoading.asObservable();

  constructor() {
    this.getMe();
  }

  login(body: { email: string; password: string }) {
    return this.httpClient
      .post<User>(`${environment.apiUrl}/auth/login`, body)
      .pipe(tap((user) => this._user.set(user)));
  }

  googleLogin(body: { idToken?: string }) {
    return this.httpClient.post<LoginApiResponse>(`${environment.apiUrl}/auth/google`, body).pipe(
      tap((value) => {
        if (value.status === 1) return;
        this._user.set(value.user);
      }),
    );
  }

  logout() {
    return this.httpClient.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(async () => {
        this.socialAuthService.signOut().catch(() => {});
        this._user.set(null);
        this.router.navigate(['/login']);
      }),
    );
  }

  register(body: { email: string; password: string }) {
    return this.httpClient.post(`${environment.apiUrl}/auth/register`, body);
  }

  getVerifyAccountByToken(token: string) {
    return this.httpClient.get<{ email: string; expiresAt: string }>(
      `${this.baseUrl}/verify-token/${token}`,
    );
  }

  getMe() {
    this.httpClient
      .get<User>(`${environment.apiUrl}/auth/me`)
      .pipe(finalize(() => this._isLoading.next(false)))
      .subscribe({
        next: (user) => {
          this._user.set(user);
        },
        error: () => {},
      });
  }

  renewOtp(token: string) {
    return this.httpClient.put<{ expiresAt: string }>(`${this.baseUrl}/renew-otp/${token}`, {});
  }

  verifyAccount(body: { token: string; otp: string }) {
    return this.httpClient.put<{ expiresAt: string }>(`${this.baseUrl}/verify-account/`, body);
  }
}
