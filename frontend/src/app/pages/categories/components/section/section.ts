import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-section',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class Section {
  categories = input.required<{ name: string }[]>();
  displayedColumns = input.required<string[]>();
}
