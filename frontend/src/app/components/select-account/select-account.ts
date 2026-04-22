import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '@app/services/account-service';

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
  private accountService = inject(AccountService);

  form = this.fb.group({
    accountId: ['', Validators.required],
  });

  accounts = this.accountService.accounts;
  selected = this.accountService.selected;

  choose() {
    if (this.form.invalid) return;
    if (isNaN(Number(this.form.value.accountId))) return;
    this.accountService.selectAccount(Number(this.form.value.accountId));
    this.dialogRef.close(this.form.value.accountId);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
