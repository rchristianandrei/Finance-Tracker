import { Component } from '@angular/core';
import { RootLayout } from '../../components/root-layout/root-layout';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AddTransaction } from '../../components/add-transaction/add-transaction';

@Component({
  selector: 'app-dashboard',
  imports: [
    RootLayout,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    BaseChartDirective,
    AddTransaction,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  transactions = [
    { date: 'Apr 1', description: 'Salary', amount: 40000, type: 'income' },
    { date: 'Apr 2', description: 'Groceries', amount: 2500, type: 'expense' },
    { date: 'Apr 3', description: 'Electric Bill', amount: 3000, type: 'expense' },
    { date: 'Apr 4', description: 'Freelance', amount: 5000, type: 'income' },
  ];

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
    labels: ['Food', 'Utilities', 'Transport'],
    datasets: [
      {
        data: [5000, 3000, 2000],
        backgroundColor: ['#ef4444', '#3b82f6', '#10b981'],
      },
    ],
  };
}
