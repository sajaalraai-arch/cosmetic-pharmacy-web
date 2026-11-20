import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { StyleLoaderService } from '../../core/services/style-loader.service';
import { Cart } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImgUrlPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  coupon = '';
  couponMessage = '';
  couponApplied = false;

  constructor(private cartService: CartService, private styles: StyleLoaderService, private router: Router) {}

  ngOnInit(): void {
   
    this.styles.load('bootstrap-css', 'assets/vendor/bootstrap/bootstrap.min.css');
    this.load();
  }

  ngOnDestroy(): void {
    this.styles.unload('bootstrap-css');
  }

  private load(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.coupon = cart.coupon ?? '';
      },
      error: (err) => alert(extractError(err))
    });
  }

  applyCoupon(): void {
    this.cartService.applyCoupon(this.coupon.trim()).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.couponMessage = cart.couponMessage ?? '';
        this.couponApplied = cart.couponApplied;
      },
      error: (err) => alert(extractError(err))
    });
  }

  updateQuantity(productId: number, action: 'plus' | 'minus', event: Event): void {
    event.preventDefault();
    this.cartService.updateQuantity(productId, action).subscribe({
      next: () => {
        this.couponMessage = '';
        this.load();
      },
      error: (err) => alert(extractError(err))
    });
  }

  removeItem(productId: number, event: Event): void {
    event.preventDefault();
    if (!confirm('Are you sure?')) return;
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.couponMessage = '';
        this.load();
      },
      error: (err) => alert(extractError(err))
    });
  }

  checkout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      alert('Your cart is empty! Please add products before checking out.');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
