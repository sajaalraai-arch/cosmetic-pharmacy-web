import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { ImgFallbackDirective } from '../../core/directives/directives';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-categories-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImgUrlPipe, ImgFallbackDirective],
  templateUrl: './categories-index.component.html',
  styleUrls: ['./categories-index.component.css']
})
export class CategoriesIndexComponent implements OnInit {
  categories: Category[] = [];
  errorMessage = '';
  private readonly themes = ['theme-blue', 'theme-green', 'theme-indigo', 'theme-yellow'];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  themeOf(index: number): string {
    return this.themes[index % this.themes.length];
  }

  private load(): void {
    this.categoryService.getAll().subscribe({
      next: (list) => (this.categories = list),
      error: (err) => (this.errorMessage = extractError(err))
    });
  }

  delete(item: Category): void {
    const message = item.productsCount > 0
      ? 'This category contains products. It will be inactivated instead of deleted to keep your products safe. Are you sure?'
      : 'Are you sure you want to delete this category?';
    if (!confirm(message)) return;

    this.categoryService.delete(item.categoryId).subscribe({
      next: () => this.load(),
      error: (err) => (this.errorMessage = extractError(err))
    });
  }
}
