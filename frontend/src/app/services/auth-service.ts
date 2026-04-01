import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../environtments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = signal<string | null>(null);

  user = this._user.asReadonly();

  constructor(private httpClient: HttpClient) {
    this.getMe();
  }

  login(body: { email: string; password: string }) {
    return this.httpClient
      .post<{ email: string }>(`${environment.apiUrl}/auth/login`, body)
      .pipe(tap((user) => this._user.set(user.email)));
  }

  register(body: { email: string; password: string }) {
    return this.httpClient.post(`${environment.apiUrl}/auth/register`, body);
  }

  getMe() {
    this.httpClient.get<{ email: string }>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        this._user.set(user.email);
        console.log(this.user());
      },
      error: () => {},
    });
  }
}
