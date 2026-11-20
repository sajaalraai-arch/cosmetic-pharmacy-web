import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Cart, PlaceOrderRequest } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImgUrlPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  submitting = false;

  form: PlaceOrderRequest = { fullName: '', phone: '', city: '', address: '', paymentMethod: 'card' };

  constructor(private cartService: CartService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form.fullName = this.auth.currentUser?.fullName ?? '';

    this.cartService.getCheckout().subscribe({
      next: (cart) => (this.cart = cart),
      error: (err) => {
      
        alert(extractError(err));
        this.router.navigate(['/cart']);
      }
    });
  }

  placeOrder(): void {
    this.submitting = true;
    this.cartService.placeOrder(this.form).subscribe({
      next: (res) => {
        alert(res.message);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.submitting = false;
        alert(extractError(err));
      }
    });
  }
}
