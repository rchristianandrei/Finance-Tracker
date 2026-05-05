import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
import { AccountService } from '@app/services/account-service';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);

  // Events
  deleteEvent = signal<Transaction | null>(null);
  updateEvent = signal<Transaction | null>(null);

  private today = new Date();
  private last30Days = new Date();
  filterForm = this.fb.group({
    searchTerm: [''],
    dateRange: this.fb.group({
      start: new FormControl(this.last30Days, Validators.required),
      end: new FormControl(this.today, Validators.required),
    }),
  });

  get f() {
    return this.filterForm.controls;
  }

  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];

  totalTransactions = signal(0);
  paginationDetails = signal({
    page: 0,
  });

  dataSource = signal<Transaction[]>([]);
  isLoading = signal(false);

  constructor() {
    this.last30Days.setDate(this.today.getDate() - 30);
  }

  ngOnInit(): void {
    this.loadTransactions();

    this.filterForm.controls.searchTerm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.loadTransactions());

    this.filterForm.controls.dateRange.controls.end.valueChanges.subscribe((value) => {
      if (!value) return;
      this.loadTransactions();
    });
  }

  applyFilters() {
    this.loadTransactions();
  }

  clearFilters() {
    this.f.searchTerm.reset();
    this.f.dateRange.controls.start.setValue(this.last30Days);
    this.f.dateRange.controls.end.setValue(this.today);
    this.loadTransactions();
  }

  onPageChange(event: any) {
    this.paginationDetails.update((p) => ({
      ...p,
      page: event.pageIndex,
    }));
    this.loadTransactions();
  }

  loadTransactions() {
    console.log(this.isLoading());
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const accountId = this.accountService.selected()?.id;
    if (!accountId) return;

    let filter = {
      search: this.f.searchTerm.value ?? undefined,
      startDate: this.f.dateRange.controls.start.value ?? undefined,
      endDate: this.f.dateRange.controls.end.value ?? undefined,
      page: this.paginationDetails().page + 1,
    };

    this.transactionService
      .readTransactions(accountId, filter)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (value) => {
          this.dataSource.set(value.data);
          this.totalTransactions.set(value.totalCount);
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
