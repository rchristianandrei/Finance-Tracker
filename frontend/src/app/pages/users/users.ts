import { Component, effect, inject, signal } from '@angular/core';
import { RootLayout } from '@app/components/root-layout/root-layout';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { User } from '@app/types/user';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '@app/services/user-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    RootLayout,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatDatepickerModule,
    DatePipe,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
  providers: [UserService],
})
export class Users {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'createdAt', 'actions'];

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  totalItems = signal(0);
  paginationDetails = signal({
    page: 0,
    pageSize: 10,
  });

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

  dataSource = signal<User[]>([]);

  constructor() {
    this.last30Days.setDate(this.today.getDate() - 30);
    effect(() => {
      this.loadUsers();
    });

    effect(() => {
      console.log(this.dataSource());
    });
  }

  applyFilters() {
    this.loadUsers();
  }

  clearFilters() {
    this.f.searchTerm.reset();
    this.f.dateRange.controls.start.setValue(this.last30Days);
    this.f.dateRange.controls.end.setValue(this.today);
    this.loadUsers();
  }

  onPageChange(event: any) {
    this.paginationDetails.update((p) => ({
      ...p,
      pageSize: event.pageSize,
      page: event.pageIndex,
    }));
    this.loadUsers();
  }

  loadUsers() {
    let filter = {
      search: this.f.searchTerm.value ?? undefined,
      startDate: this.f.dateRange.controls.start.value ?? undefined,
      endDate: this.f.dateRange.controls.end.value ?? undefined,
      pageSize: this.paginationDetails().pageSize,
      page: this.paginationDetails().page + 1,
    };

    this.userService.getUsers(filter).subscribe({
      next: (value) => {
        this.dataSource.set(value.data);
        this.totalItems.set(value.totalCount);
      },
    });
  }
}
