import { Component, effect, inject, signal } from '@angular/core';
import { RootLayout } from '@app/components/root-layout/root-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Section } from './components/section/section';
import { MatDialog } from '@angular/material/dialog';
import { AddCategory } from './components/add-category/add-category';
import { finalize } from 'rxjs';
import { CategoryService } from '@app/services/category-service';
import { Category } from '@app/types/category';

@Component({
  selector: 'app-categories',
  imports: [RootLayout, MatCardModule, MatButtonModule, MatTableModule, MatIconModule, Section],
  templateUrl: './categories.html',
})
export class Categories {
  private dialog = inject(MatDialog);
  private categoryService = inject(CategoryService);

  displayedColumns = ['name', 'actions'];

  readonly expenseCategories = this.categoryService.ExpenseCategories;
  readonly incomeCategories = this.categoryService.IncomeCategories;
  readonly isCreateOpen = signal(false);

  onCreate() {
    if (this.isCreateOpen()) return;
    this.isCreateOpen.set(true);

    const createDialog = this.dialog.open(AddCategory);

    createDialog
      .afterClosed()
      .pipe(finalize(() => this.isCreateOpen.set(false)))
      .subscribe({
        next: () => {},
      });
  }
}
