import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Account } from '@app/types/account';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { finalize, tap } from 'rxjs';
import { ToastService } from './toast-service';
import { resolveHttpError } from '@app/utils/http-error.util';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = `${environment.apiUrl}/account`;
  private readonly storageKey = 'selectedAccount';

  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  private _isLoading = signal(true);
  private _selected = signal<Account | null>(null);
  private _default = signal<Account | null>(null);
  private _accounts = signal<Account[]>([]);

  public readonly isLoading = this._isLoading.asReadonly();
  public readonly selected = this._selected.asReadonly();
  public readonly default = this._default.asReadonly();
  public readonly accounts = this._accounts.asReadonly();

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (!user) return;

      this._isLoading.set(true);

      this.getAccounts()
        .pipe(finalize(() => this._isLoading.set(false)))
        .subscribe({
          next: (accounts) => {
            const storedAccount = sessionStorage.getItem(this.storageKey);
            if (storedAccount) {
              const { accountId } = JSON.parse(storedAccount);
              const account = accounts.accounts.find((a) => a.id === accountId) || null;
              this._selected.set(account);
            } else {
              this._selected.set(accounts.defaultAccount);
            }
            this._default.set(accounts.defaultAccount);
            this._accounts.set(accounts.accounts);
          },
          error: (err) => {
            this.toastService.error(resolveHttpError(err) || 'Failed to load accounts');
          },
        });
    });
  }

  private getAccounts() {
    return this.httpClient.get<{ accounts: Account[]; defaultAccount: Account | null }>(
      `${this.baseUrl}`,
    );
  }

  public selectAccount(accountId: number) {
    const account = this._accounts().find((a) => a.id === accountId) || null;
    sessionStorage.setItem(this.storageKey, JSON.stringify({ accountId }));
    this._selected.set(account);
  }

  public createAccount(name: string) {
    return this.httpClient.post<Account>(`${this.baseUrl}`, { name }).pipe(
      tap((account) => {
        this._accounts.update((accounts) => [...accounts, account]);
      }),
    );
  }

  public updateAccount(body: { id: number; name: string; isDefault: boolean }) {
    return this.httpClient
      .put(`${this.baseUrl}/${body.id}`, { name: body.name, isDefault: body.isDefault })
      .pipe(
        tap(() => {
          this._accounts.update((accounts) =>
            accounts.map((a) =>
              a.id === body.id ? { ...a, name: body.name, isDefault: body.isDefault } : a,
            ),
          );
          if (body.isDefault) {
            this._default.set(this._accounts().find((a) => a.id === body.id) || null);
          }
        }),
      );
  }

  public deleteAccount(accountId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${accountId}`).pipe(
      tap(() => {
        this._accounts.update((accounts) => accounts.filter((a) => a.id !== accountId));
      }),
    );
  }
}
