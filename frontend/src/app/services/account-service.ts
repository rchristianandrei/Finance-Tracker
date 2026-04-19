import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Account } from '@app/types/account';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = `${environment.apiUrl}/account`;

  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);

  private currentAccount = signal<Account | null>(null);
  private acounts = signal<Account[]>([]);

  public readonly current = this.currentAccount.asReadonly();
  public readonly accounts = this.acounts.asReadonly();

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (!user) return;
      this.getAccounts().subscribe({
        next: (accounts) => {
          this.acounts.set(accounts);
          this.currentAccount.set(
            accounts.find((account) => account.id === user.defaultAccountId) || null,
          );
        },
        error: (err) => {
          console.error('Failed to fetch accounts', err);
        },
      });
    });
  }

  private getAccounts() {
    return this.httpClient.get<Account[]>(`${this.baseUrl}`);
  }
}
