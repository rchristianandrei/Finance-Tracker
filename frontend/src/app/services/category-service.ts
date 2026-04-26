import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TransactionType } from '@app/types/transaction';
import { environment } from '@env/environment';
import { AccountService } from './account-service';
import { finalize, tap } from 'rxjs';
import { Category } from '@app/types/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiUrl}/category`;

  private httpClient = inject(HttpClient);
  private accountService = inject(AccountService);

  private _isLoading = signal(true);
  private _expenseCategories = signal<Category[]>([]);
  private _incomeCategories = signal<Category[]>([]);

  public isLoading = this._isLoading.asReadonly();
  public ExpenseCategories = this._expenseCategories.asReadonly();
  public IncomeCategories = this._incomeCategories.asReadonly();

  constructor() {
    effect(() => {
      const account = this.accountService.selected();
      if (!account) return;
      this.getAll()
        .pipe(finalize(() => this._isLoading.set(false)))
        .subscribe({
          next: (value) => {
            this._expenseCategories.set(value.expense);
            this._incomeCategories.set(value.income);
          },
        });
    });
  }

  public Create(body: { type: TransactionType; name: string }) {
    return this.httpClient
      .post<Category>(`${this.baseUrl}`, {
        ...body,
        type: body.type === 'EXPENSE' ? 1 : 2,
        accountId: this.accountService.selected()?.id ?? 0,
      })
      .pipe(
        tap((value) => {
          let category: WritableSignal<Category[]>;
          switch (body.type) {
            case 'EXPENSE':
              category = this._expenseCategories;
              break;
            case 'INCOME':
              category = this._incomeCategories;
              break;
          }
          category.update((old) => [...old, value].sort((a, b) => a.name.localeCompare(b.name)));
        }),
      );
  }

  public getAll() {
    return this.httpClient.get<{
      income: Category[];
      expense: Category[];
    }>(`${this.baseUrl}/${this.accountService.selected()?.id ?? 0}`);
  }

  public update({ category, type }: { category: Category; type: TransactionType }) {
    return this.httpClient
      .put(`${this.baseUrl}/${category.id}`, {
        id: category.id,
        type: type === 'EXPENSE' ? 1 : 2,
        name: category.name,
      })
      .pipe(
        tap(() => {
          let list: WritableSignal<Category[]>;
          switch (type) {
            case 'EXPENSE':
              list = this._expenseCategories;
              break;
            case 'INCOME':
              list = this._incomeCategories;
              break;
          }
          list.update((old) => old.map((c) => (c.id === category.id ? category : c)));
        }),
      );
  }

  public delete(categoryId: number, type: TransactionType) {
    return this.httpClient.delete(`${this.baseUrl}/${categoryId}`).pipe(
      tap(() => {
        let category: WritableSignal<Category[]>;
        switch (type) {
          case 'EXPENSE':
            category = this._expenseCategories;
            break;
          case 'INCOME':
            category = this._incomeCategories;
            break;
        }
        category.update((old) => old.filter((c) => c.id !== categoryId));
      }),
    );
  }
}
