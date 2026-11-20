import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductListItem } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { SettingsMenuDirective } from '../../core/directives/directives';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-product-caty',
  standalone: true,
  imports: [CommonModule, RouterLink, ImgUrlPipe, SettingsMenuDirective],
  templateUrl: './product-caty.component.html',
  styleUrls: ['./product-caty.component.css']
})
export class ProductCatyComponent implements OnInit {
  products: ProductListItem[] = [];
  wishlist = new Set<number>();
  readonly cartCount$ = this.cartService.count$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    
    this.route.queryParamMap.subscribe((params) => {
      const categoryName = params.get('category') ?? undefined;
      this.productService.getAll({ categoryName, filter: 'active', hideExpired: true }).subscribe({
        next: (res) => (this.products = res.products),
        error: (err) => console.error(extractError(err))
      });
    });
  }

  toggleWish(productId: number): void {
    if (this.wishlist.has(productId)) this.wishlist.delete(productId);
    else this.wishlist.add(productId);
  }

  addToCart(productId: number): void {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => this.router.navigate(['/cart']),
      error: (err) => alert(extractError(err))
    });
  }
}
