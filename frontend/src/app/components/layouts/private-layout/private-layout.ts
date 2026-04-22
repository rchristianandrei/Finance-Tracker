import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from '@app/services/account-service';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout {
  private accountService = inject(AccountService);

  isLoading = this.accountService.isLoading;
}
