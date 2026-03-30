import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environtments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  register(body: { email: string; password: string }) {
    return this.httpClient.post(`${environment.apiUrl}/auth/register`, body);
  }
}
