import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategory, CategoryFormData } from '../components/add-category/add-category';
import { CategoryService } from '@app/services/category-service';
import { finalize } from 'rxjs';
import { ToastService } from '@app/services/toast-service';
import { Category } from '@app/types/category';
import { TransactionType } from '@app/types/transaction';

@Injectable({
  providedIn: 'root',
})
export class SaveCategoryService {
  private dialog = inject(MatDialog);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  showCreateDialog() {
    const createDialog = this.dialog.open<AddCategory, CategoryFormData>(AddCategory, {
      data: { heading: 'Create Category', confirmButtonText: 'Add' },
    });
    const instance = createDialog.componentInstance;

    instance.onSubmit.subscribe((value) => {
      this.categoryService
        .Create(value)
        .pipe(finalize(() => instance.stopLoading()))
        .subscribe({
          next: () => {
            this.toastService.success('Created a category');
            instance.close();
          },
        });
    });

    return createDialog;
  }

  showUpdateDialog(category: Category, type: TransactionType) {
    const updateDialog = this.dialog.open<AddCategory, CategoryFormData>(AddCategory, {
      data: {
        heading: 'Update Category',
        category: category,
        type: type,
        confirmButtonText: 'Save',
      },
    });
    const instance = updateDialog.componentInstance;

    instance.onSubmit.subscribe((value) => {
      this.categoryService
        .update({ category: { ...category, name: value.name }, type: value.type })
        .pipe(finalize(() => instance.stopLoading()))
        .subscribe({
          next: () => {
            this.toastService.success('Updated a category');
            instance.close();
          },
        });
    });

    return updateDialog;
  }
}
