import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = signal<string | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(true);

  user = this._user.asReadonly();
  isLoading = this._isLoading.asObservable();

  constructor(private httpClient: HttpClient) {
    this.getMe();
  }

  login(body: { email: string; password: string }) {
    return this.httpClient
      .post<{ email: string }>(`${environment.apiUrl}/auth/login`, body)
      .pipe(tap((user) => this._user.set(user.email)));
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
      .get<{ email: string }>(`${environment.apiUrl}/auth/me`)
      .pipe(finalize(() => this._isLoading.next(false)))
      .subscribe({
        next: (user) => {
          this._user.set(user.email);
        },
        error: () => {},
      });
  }
}
