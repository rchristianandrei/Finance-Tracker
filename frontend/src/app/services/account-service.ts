import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Account } from '@app/types/account';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { tap } from 'rxjs';

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

  public createAccount(name: string) {
    return this.httpClient.post<Account>(`${this.baseUrl}`, { name }).pipe(
      tap((account) => {
        this.acounts.update((accounts) => [...accounts, account]);
      }),
    );
  }

  public updateAccount(body: { id: number; name: string; isDefault: boolean }) {
    return this.httpClient
      .put(`${this.baseUrl}/${body.id}`, { name: body.name, isDefault: body.isDefault })
      .pipe(
        tap(() => {
          this.acounts.update((accounts) =>
            accounts.map((a) =>
              a.id === body.id ? { ...a, name: body.name, isDefault: body.isDefault } : a,
            ),
          );
          if (body.isDefault) {
            this.currentAccount.set(this.acounts().find((a) => a.id === body.id) || null);
          }
        }),
      );
  }

  public deleteAccount(accountId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${accountId}`).pipe(
      tap(() => {
        this.acounts.update((accounts) => accounts.filter((a) => a.id !== accountId));
      }),
    );
  }
}
