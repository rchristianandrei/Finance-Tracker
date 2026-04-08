import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { RootLayout } from '@app/components/root-layout/root-layout';
import { TransactionService } from '@app/services/transaction-service';
import { TransactionType } from '@app/types/transaction';
import { AddTransaction } from '@app/components/add-transaction/add-transaction';

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
    AddTransaction,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  filterForm = this.fb.group({
    searchTerm: [''],
    startDate: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required],
  });

  get f() {
    return this.filterForm.controls;
  }

  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];

  paginationDetails = signal({
    page: 0,
    pageSize: 10,
    totalItems: 0,
  });

  dataSource = signal<TransactionType[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  applyFilters() {
    this.loadTransactions();
  }

  clearFilters() {
    this.f.searchTerm.reset();
    this.f.startDate.setValue(new Date());
    this.f.endDate.setValue(new Date());
  }

  onPageChange(event: any) {
    this.paginationDetails.update((p) => ({
      ...p,
      pageSize: event.pageSize,
      page: event.pageIndex,
    }));
    this.loadTransactions();
  }

  loadTransactions() {
    let filter = {
      search: this.f.searchTerm.value ?? undefined,
      startDate: this.f.startDate.value ?? undefined,
      endDate: this.f.endDate.value ?? undefined,
      pageSize: this.paginationDetails().pageSize,
      page: this.paginationDetails().page + 1,
    };

    this.transactionService.getTransactions(filter).subscribe({
      next: (value) => {
        this.dataSource.set(value.data);
        this.paginationDetails.update((p) => ({ ...p, totalItems: value.totalCount }));
      },
    });
  }
}
