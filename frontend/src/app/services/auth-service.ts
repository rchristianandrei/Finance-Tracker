import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '@app/types/user';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

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

  googleLogin(body: { idToken?: string }) {
    return this.httpClient
      .post<User>(`${this.baseUrl}/google`, body)
      .pipe(tap((user) => this._user.set(user)));
  }

  logout() {
    return this.httpClient.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(async () => {
        this.socialAuthService.signOut().catch(() => {});
        this._user.set(null);
        this.router.navigate(['/login']);
      }),
    );
  }

  getMe() {
    this.httpClient
      .get<User>(`${this.baseUrl}/me`)
      .pipe(finalize(() => this._isLoading.next(false)))
      .subscribe({
        next: (user) => {
          this._user.set(user);
        },
        error: () => {},
      });
  }
}
