import { ChangeDetectorRef, Component, effect, inject, OnInit, signal } from '@angular/core';
import { RootLayout } from '../../components/root-layout/root-layout';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AddTransaction } from '../../components/add-transaction/add-transaction';
import { TransactionService } from '../../services/transaction-service';
import { DashboardType } from '../../types/dashboard';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    RootLayout,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    BaseChartDirective,
    AddTransaction,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private transactionService = inject(TransactionService);

  public dashboardData = signal<DashboardType>({
    balance: 0,
    income: 0,
    expenses: 0,
    expensesBreakdown: [],
    transactions: [],
  });

  transactions = signal([
    { date: 'Apr 1', description: 'Salary', amount: 40000, type: 'income' },
    { date: 'Apr 2', description: 'Groceries', amount: 2500, type: 'expense' },
    { date: 'Apr 3', description: 'Electric Bill', amount: 3000, type: 'expense' },
    { date: 'Apr 4', description: 'Freelance', amount: 5000, type: 'income' },
  ]);

  public chartDataLabels = ChartDataLabels;

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data as number[];
          const total = data.reduce((a, b) => a + b, 0);
          const percentage = (value / total) * 100;
          return percentage.toFixed(1) + '%';
        },
      },
    },
  };

  public pieChartType: 'pie' = 'pie';

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#ef4444', '#3b82f6', '#10b981'],
      },
    ],
  };

  constructor() {
    effect(() => {
      let labels: string[] = [];
      let data: number[] = [];
      this.dashboardData().expensesBreakdown.forEach((kvp) => {
        labels.push(kvp.key);
        data.push(kvp.value);
      });

      this.pieChartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['#ef4444', '#3b82f6', '#10b981'],
          },
        ],
      };

      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.transactionService.getDashboardData().subscribe({
      next: (value) => {
        this.dashboardData.set(value);
      },
    });
  }
}
