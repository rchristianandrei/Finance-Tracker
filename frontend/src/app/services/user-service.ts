import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@app/types/user';
import { map } from 'rxjs';
import { API_ROUTES } from './_api-routes';

@Injectable()
export class UserService {
  private http = inject(HttpClient);

  getUsers(filter?: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
    pageSize?: number;
    page?: number;
  }) {
    let params = new HttpParams();

    if (filter?.search) {
      params = params.set('Search', filter.search);
    }

    if (filter?.startDate) {
      params = params.set('StartDate', filter.startDate.toISOString());
    }

    if (filter?.endDate) {
      params = params.set('EndDate', filter.endDate.toISOString());
    }

    if (filter?.pageSize) {
      params = params.set('PageSize', filter.pageSize);
    }

    if (filter?.page) {
      params = params.set('Page', filter.page);
    }

    return this.http
      .get<{ data: User[]; totalCount: number }>(API_ROUTES.user.getAll(), { params })
      .pipe(
        map((res) => ({
          ...res,
          data: res.data.map((t) => ({
            ...t,
            date: new Date(t.createdAt),
          })),
        })),
      );
  }

  update(user: {
    id: number;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    status: number;
  }) {
    return this.http.put<User>(API_ROUTES.user.update(user.id), user);
  }

  delete(userId: number) {
    return this.http.delete(API_ROUTES.user.update(userId));
  }
}
