import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategory } from '../components/add-category/add-category';
import { CategoryService } from '@app/services/category-service';
import { finalize } from 'rxjs';
import { ToastService } from '@app/services/toast-service';

@Injectable({
  providedIn: 'root',
})
export class AddCategoryService {
  private dialog = inject(MatDialog);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  showDialog() {
    const createDialog = this.dialog.open(AddCategory);
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
}
