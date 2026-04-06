import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RootLayout } from '../../components/root-layout/root-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transactions',
  imports: [
    MatButtonModule,
    RootLayout,
    DatePipe,
    DecimalPipe,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './transactions.html',
})
export class Transactions {
  private fb = inject(FormBuilder);

  filterForm = this.fb.group({
    searchTerm: [''],
    startDate: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required],
  });

  get f() {
    return this.filterForm.controls;
  }

  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];

  pageSize = 10;
  totalItems = 0;

  dataSource = [];

  applyFilters() {
    this.loadTransactions();
  }

  clearFilters() {
    this.f.searchTerm.reset();
    this.f.startDate.setValue(new Date());
    this.f.endDate.setValue(new Date());
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.loadTransactions(event.pageIndex);
  }

  loadTransactions(page: number = 0) {
    // Call API with searchTerm + filters + pagination
  }
}
