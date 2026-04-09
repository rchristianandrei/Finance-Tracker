import { Component, effect, input } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.html',
})
export class PieChart {
  pieData = input.required<{
    labels: string[];
    data: number[];
  }>();

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
      this.pieChartData = {
        labels: this.pieData().labels,
        datasets: [
          {
            data: this.pieData().data,
          },
        ],
      };
    });
  }
}
