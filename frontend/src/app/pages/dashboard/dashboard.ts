import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PieChart } from '@app/components/pie-chart/pie-chart';
import { RootLayout } from '@app/components/root-layout/root-layout';
import { AddTransaction } from '@app/components/add-transaction/add-transaction';

import { TransactionService } from '@app/services/transaction-service';
import { DashboardType } from '@app/types/dashboard';
import { AccountService } from '@app/services/account-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    RootLayout,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    AddTransaction,
    PieChart,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);

  public dashboardData = signal<DashboardType>({
    balance: 0,
    income: 0,
    expenses: 0,
    expensesBreakdown: [],
    transactions: [],
  });

  public pieData = computed(() => {
    let labels: string[] = [];
    let data: number[] = [];
    this.dashboardData().expensesBreakdown.forEach((kvp) => {
      labels.push(kvp.key);
      data.push(kvp.value);
    });
    return { labels, data };
  });

  constructor() {
    effect(() => {
      this.loadDashboard();
    });
  }

  loadDashboard() {
    const accountId = this.accountService.selected()?.id;
    if (!accountId) return;
    this.transactionService.getDashboardData(accountId).subscribe({
      next: (value) => {
        this.dashboardData.set(value);
      },
    });
  }
}
