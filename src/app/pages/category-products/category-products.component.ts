import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductListItem, ProductStats } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImgUrlPipe],
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  categoryId = 0;
  categoryName = '';
  products: ProductListItem[] = [];
  stats: ProductStats = { totalProducts: 0, lowStock: 0, expiringSoon: 0, activeItems: 0 };
  search = '';
  filter = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryId = Number(params.get('id'));
      this.load();
    });
    this.route.queryParamMap.subscribe((params) => {
      this.filter = params.get('filter') ?? '';
      if (this.categoryId) this.load();
    });
  }

  load(): void {
    this.productService.getAll({ categoryId: this.categoryId, search: this.search.trim(), filter: this.filter }).subscribe({
      next: (res) => {
        this.products = res.products;
        this.stats = res.stats;
        this.categoryName = res.categoryName ?? '';
      },
      error: (err) => (this.errorMessage = extractError(err))
    });
  }

  setFilter(filter: string): void {
    this.router.navigate(['/admin/categories', this.categoryId, 'products'], { queryParams: { filter: filter || null } });
  }

  handleSearchInput(): void {
   
  }

  clearSearch(): void {
    this.search = '';
    this.load();
  }


  deleteProduct(item: ProductListItem): void {
    if (!confirm('Are you sure?')) return;

    this.productService.delete(item.productId).subscribe({
      next: () => this.load(),
      error: (err: HttpErrorResponse) => {
        if (err.status === 409 && err.error?.canDeactivate) {
          if (confirm(err.error.message)) {
            this.productService.delete(item.productId, 'deactivate').subscribe({
              next: () => this.load(),
              error: (e) => (this.errorMessage = extractError(e))
            });
          }
        } else {
          this.errorMessage = extractError(err);
        }
      }
    });
  }
}
