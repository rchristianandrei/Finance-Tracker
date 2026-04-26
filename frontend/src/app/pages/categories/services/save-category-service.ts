import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveCategory, CategoryFormData } from '../components/save-category/save-category';
import { CategoryService } from '@app/services/category-service';
import { finalize } from 'rxjs';
import { ToastService } from '@app/services/toast-service';
import { Category } from '@app/types/category';
import { resolveHttpError } from '@app/utils/http-error.util';

@Injectable({
  providedIn: 'root',
})
export class SaveCategoryService {
  private dialog = inject(MatDialog);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  private errorMessage = signal('');

  showCreateDialog() {
    const createDialog = this.dialog.open<SaveCategory, CategoryFormData>(SaveCategory, {
      data: {
        heading: 'Create Category',
        confirmButtonText: 'Add',
        errorMessage: this.errorMessage.asReadonly(),
      },
    });
    const instance = createDialog.componentInstance;

    instance.onSubmit.subscribe((value) => {
      this.errorMessage.set('');

      const list = this.categoryService.groupedCategories()[value.type];
      if (list.some((item) => item.name === value.name)) {
        this.errorMessage.set('Name already exists');
        instance.stopLoading();
        return;
      }

      this.categoryService
        .Create(value)
        .pipe(finalize(() => instance.stopLoading()))
        .subscribe({
          next: () => {
            this.toastService.success('Created a category');
            instance.close();
          },
          error: (err) => {
            this.errorMessage.set(resolveHttpError(err));
          },
        });
    });

    return createDialog;
  }

  showUpdateDialog(category: Category) {
    const updateDialog = this.dialog.open<SaveCategory, CategoryFormData>(SaveCategory, {
      data: {
        heading: 'Update Category',
        category: category,
        confirmButtonText: 'Save',
        errorMessage: this.errorMessage.asReadonly(),
      },
    });
    const instance = updateDialog.componentInstance;

    instance.onSubmit.subscribe((value) => {
      this.errorMessage.set('');

      const list = this.categoryService.groupedCategories()[value.type];
      if (list.some((item) => item.name === value.name)) {
        this.errorMessage.set('Name already exists');
        instance.stopLoading();
        return;
      }

      this.categoryService
        .update({ ...category, name: value.name, type: value.type })
        .pipe(finalize(() => instance.stopLoading()))
        .subscribe({
          next: () => {
            this.toastService.success('Updated a category');
            instance.close();
          },
          error: (err) => {
            this.errorMessage.set(resolveHttpError(err));
          },
        });
    });

    return updateDialog;
  }
}
