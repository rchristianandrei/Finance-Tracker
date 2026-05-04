import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { AccountService } from './account-service';
import { finalize, tap } from 'rxjs';
import { Category, TransactionType } from '@app/types/category';
import { API_ROUTES } from './_api-routes';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private httpClient = inject(HttpClient);
  private accountService = inject(AccountService);

  private _isLoading = signal(true);
  private _categories = signal<Category[]>([]);

  public readonly isLoading = this._isLoading.asReadonly();
  public readonly categories = this._categories.asReadonly();
  public readonly groupedCategories = computed(() =>
    this._categories().reduce(
      (acc, category) => {
        const key = category.type;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(category);
        return acc;
      },
      {} as Record<TransactionType, Category[]>,
    ),
  );

  constructor() {
    effect(() => {
      const account = this.accountService.selected();
      if (!account) return;
      this.getAll()
        .pipe(finalize(() => this._isLoading.set(false)))
        .subscribe();
    });
  }

  public Create(body: { type: TransactionType; name: string }) {
    return this.httpClient
      .post<Category>(API_ROUTES.category.create(), {
        ...body,
        type: body.type,
        accountId: this.accountService.selected()?.id ?? 0,
      })
      .pipe(
        tap((value) => {
          this._categories.update((old) =>
            [...old, value].sort((a, b) => a.name.localeCompare(b.name)),
          );
        }),
      );
  }

  public getAll() {
    return this.httpClient
      .get<Category[]>(API_ROUTES.category.getCategories(this.accountService.selected()?.id ?? 0))
      .pipe(
        tap((value) => {
          this._categories.set(value);
        }),
      );
  }

  public update(category: Category) {
    return this.httpClient
      .put(API_ROUTES.category.update(category.id), {
        id: category.id,
        type: category.type,
        name: category.name,
      })
      .pipe(
        tap(() => {
          this._categories.update((old) =>
            old
              .map((c) => (c.id === category.id ? category : c))
              .sort((a, b) => a.name.localeCompare(b.name)),
          );
        }),
      );
  }

  public delete(categoryId: number) {
    return this.httpClient.delete(API_ROUTES.category.delete(categoryId)).pipe(
      tap(() => {
        this._categories.update((old) => old.filter((c) => c.id !== categoryId));
      }),
    );
  }
}
