import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@app/services/auth-service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  protected authService = inject(AuthService);
}
