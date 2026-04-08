import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { Transaction } from '@app/types/transaction';
import { AddTransaction } from '@app/components/add-transaction/add-transaction';
import { DeleteTransaction } from './components/delete-transaction/delete-transaction';
import { UpdateTransaction } from './components/update-transaction/update-transaction';

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
    DeleteTransaction,
    UpdateTransaction,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  // Events
  deleteEvent = signal<Transaction | null>(null);
  updateEvent = signal<Transaction | null>(null);

  filterForm = this.fb.group({
    searchTerm: [''],
    dateRange: this.fb.group({
      start: new FormControl(new Date(), Validators.required),
      end: new FormControl(new Date(), Validators.required),
    }),
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

  dataSource = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  applyFilters() {
    this.loadTransactions();
  }

  clearFilters() {
    this.f.searchTerm.reset();
    this.f.dateRange.controls.start.setValue(new Date());
    this.f.dateRange.controls.end.setValue(new Date());
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
      startDate: this.f.dateRange.controls.start.value ?? undefined,
      endDate: this.f.dateRange.controls.end.value ?? undefined,
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

  onStartDelete(transaction: Transaction) {
    this.deleteEvent.set(transaction);
  }

  onEndDelete(success: boolean) {
    this.deleteEvent.set(null);
    if (!success) return;
    this.loadTransactions();
  }

  onStartUpdate(transaction: Transaction) {
    this.updateEvent.set(transaction);
  }

  onEndUpdate(success: boolean) {
    this.updateEvent.set(null);
    if (!success) return;
    this.loadTransactions();
  }
}
