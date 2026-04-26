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
import { DeleteCategory, DeleteCategoryData } from './components/delete-category/delete-category';
import { TransactionType } from '@app/types/transaction';
import { SaveCategoryService } from './services/add-category-service';

@Component({
  selector: 'app-categories',
  imports: [RootLayout, MatCardModule, MatButtonModule, MatTableModule, MatIconModule, Section],
  templateUrl: './categories.html',
  providers: [AddCategory],
})
export class Categories {
  private dialog = inject(MatDialog);
  private categoryService = inject(CategoryService);
  private addCategory = inject(SaveCategoryService);

  displayedColumns = ['name', 'actions'];

  readonly expenseCategories = this.categoryService.ExpenseCategories;
  readonly incomeCategories = this.categoryService.IncomeCategories;
  readonly isDialogOpen = signal(false);

  onCreate() {
    if (this.isDialogOpen()) return;
    this.isDialogOpen.set(true);

    const createDialog = this.addCategory.showCreateDialog();

    createDialog
      .afterClosed()
      .pipe(finalize(() => this.isDialogOpen.set(false)))
      .subscribe();
  }

  onUpdate(category: Category, type: TransactionType) {
    if (this.isDialogOpen()) return;
    this.isDialogOpen.set(true);

    const createDialog = this.addCategory.showUpdateDialog(category, type);

    createDialog
      .afterClosed()
      .pipe(finalize(() => this.isDialogOpen.set(false)))
      .subscribe();
  }

  onDelete(category: Category, type: TransactionType) {
    if (this.isDialogOpen()) return;
    this.isDialogOpen.set(true);

    const deleteDialog = this.dialog.open<DeleteCategory, DeleteCategoryData>(DeleteCategory, {
      data: {
        category: category,
        type: type,
      },
    });

    deleteDialog
      .afterClosed()
      .pipe(finalize(() => this.isDialogOpen.set(false)))
      .subscribe();
  }
}
