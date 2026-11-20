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
  selector: 'app-products-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImgUrlPipe],
  templateUrl: './products-index.component.html',
  styleUrls: ['./products-index.component.css']
})
export class ProductsIndexComponent implements OnInit {
  products: ProductListItem[] = [];
  stats: ProductStats = { totalProducts: 0, lowStock: 0, expiringSoon: 0, activeItems: 0 };
  search = '';
  filter = '';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.search = params.get('search') ?? '';
      this.filter = params.get('filter') ?? '';
      this.load();
    });
  }

  load(): void {
    this.productService.getAll({ search: this.search.trim(), filter: this.filter }).subscribe({
      next: (res) => {
        this.products = res.products;
        this.stats = res.stats;
      },
      error: (err) => (this.errorMessage = extractError(err))
    });
  }

  setFilter(filter: string): void {
    this.router.navigate(['/admin/products'], { queryParams: { filter: filter || null } });
  }

  handleSearchInput(): void {
    if (this.search.length === 0) this.load();
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
