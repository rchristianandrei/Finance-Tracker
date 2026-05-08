import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RootLayout } from '@app/components/root-layout/root-layout';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '@app/services/user-service';
import { DatePipe } from '@angular/common';
import { ManageUsersService } from './services/manage-users-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
  providers: [UserService, ManageUsersService],
})
export class Users implements OnInit {
  private fb = inject(FormBuilder);

  protected readonly displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'createdAt',
    'actions',
  ];
  protected readonly manageUsersService = inject(ManageUsersService);

  protected readonly page = signal(0);

  private today = new Date();
  private last30Days = new Date();
  protected readonly filterForm = this.fb.group({
    searchTerm: [''],
    dateRange: this.fb.group({
      start: new FormControl(this.last30Days, Validators.required),
      end: new FormControl(this.today, Validators.required),
    }),
  });
  get f() {
    return this.filterForm.controls;
  }

  constructor() {
    this.last30Days.setDate(this.today.getDate() - 30);
  }

  ngOnInit(): void {
    this.loadUsers();

    this.filterForm.controls.searchTerm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.loadUsers());

    this.filterForm.controls.dateRange.controls.end.valueChanges.subscribe((value) => {
      if (!value) return;
      this.loadUsers();
    });
  }

  clearFilters() {
    this.f.searchTerm.reset();
    this.f.dateRange.controls.start.setValue(this.last30Days);
    this.f.dateRange.controls.end.setValue(this.today);
    this.loadUsers();
  }

  onPageChange(event: any) {
    this.page.set(event.pageIndex);
    this.loadUsers();
  }

  loadUsers() {
    const filter = {
      search: this.f.searchTerm.value ?? undefined,
      startDate: this.f.dateRange.controls.start.value ?? undefined,
      endDate: this.f.dateRange.controls.end.value ?? undefined,
      page: this.page() + 1,
    };

    this.manageUsersService.loadUsers(filter);
  }
}
