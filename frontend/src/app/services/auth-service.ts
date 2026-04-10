import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '@app/types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = signal<User | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(true);

  user = this._user.asReadonly();
  isLoading = this._isLoading.asObservable();

  constructor(private httpClient: HttpClient) {
    this.getMe();
  }

  login(body: { email: string; password: string }) {
    return this.httpClient
      .post<User>(`${environment.apiUrl}/auth/login`, body)
      .pipe(tap((user) => this._user.set(user)));
  }

  googleLogin(body: { idToken?: string }) {
    return this.httpClient
      .post<User>(`${environment.apiUrl}/auth/google`, body)
      .pipe(tap((user) => this._user.set(user)));
  }

  logout() {
    return this.httpClient
      .post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(tap(() => this._user.set(null)));
  }

  register(body: { email: string; password: string }) {
    return this.httpClient.post(`${environment.apiUrl}/auth/register`, body);
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
}
