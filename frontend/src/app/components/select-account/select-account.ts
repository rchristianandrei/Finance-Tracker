import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-select-account',
  imports: [
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './select-account.html',
})
export class SelectAccount {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SelectAccount>);

  form = this.fb.group({
    account: ['', Validators.required],
  });

  accounts = ['Option 1', 'Option 2', 'Option 3'];

  choose() {
    this.dialogRef.close(this.form.value.account);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
