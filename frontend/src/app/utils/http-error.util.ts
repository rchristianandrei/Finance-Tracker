import { HttpErrorResponse } from '@angular/common/http';

export function resolveHttpError(err: HttpErrorResponse): string {
  switch (err.status) {
    case 0:
      return 'Unable to reach the server. Please check your connection.';
    case 400:
      return err.error ?? 'Bad request.';
    case 401:
      return 'You are not authorized. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return err.error ?? 'A conflict occurred.';
    case 422:
      return err.error ?? 'Validation failed.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    default:
      return err.error ?? err.message ?? 'An unexpected error occurred.';
  }
}
