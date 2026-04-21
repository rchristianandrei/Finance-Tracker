import { Component, inject, output, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

export type AccountFormData = {
  errorMessage: Signal<string>;
};

@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule, MatDialogModule, MatInputModule, MatButtonModule],
  templateUrl: './account-form.html',
})
export class AccountForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AccountForm>);

  data = inject<AccountFormData>(MAT_DIALOG_DATA);

  onCreate = output<string>();

  form = this.fb.group({
    name: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    const accountName = this.form.value.name;
    this.onCreate.emit(accountName!);
  }

  cancel() {
    this.dialogRef.close();
  }
}
