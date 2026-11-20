import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private cart: CartService) {}

  ngOnInit(): void {
    this.auth.loadCurrentUser().subscribe((user) => {
      if (user) this.cart.refreshCount();
    });
  }
}
