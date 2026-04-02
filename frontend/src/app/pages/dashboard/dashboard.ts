import { Component } from '@angular/core';
import { RootLayout } from '../../components/root-layout/root-layout';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  imports: [RootLayout, MatCardModule, MatProgressBarModule, MatTableModule],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  transactions = [
    { date: 'Apr 1', description: 'Salary', amount: 40000, type: 'income' },
    { date: 'Apr 2', description: 'Groceries', amount: 2500, type: 'expense' },
    { date: 'Apr 3', description: 'Electric Bill', amount: 3000, type: 'expense' },
    { date: 'Apr 4', description: 'Freelance', amount: 5000, type: 'income' },
  ];
}
