import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-expense',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-expense.html',
})
export class AddExpense {
  closed = output();

  categories = ['Food', 'Transportation', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

  form: FormGroup;
  get f() {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      date: [this.getNow(), Validators.required],
    });
  }

  getNow(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (this.form.invalid) return;
    console.log(this.form.value);
    this.close();
  }
}
