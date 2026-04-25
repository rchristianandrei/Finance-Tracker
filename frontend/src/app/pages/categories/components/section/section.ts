import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '@app/types/category';

@Component({
  selector: 'app-section',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class Section {
  categories = input.required<Category[]>();
  displayedColumns = input.required<string[]>();
}
