import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { extractError } from '../../core/services/http-helpers';
import { SettingsMenuDirective } from '../../core/directives/directives';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SettingsMenuDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  readonly user$ = this.auth.user$;
  readonly cartCount$ = this.cart.count$;

  emails: string[] = [];
  signUpMode = false;

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';

  errorMessage = '';
  successMessage = '';
  registerError = '';

  constructor(private auth: AuthService, private cart: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmails();
  }

  private loadEmails(): void {
    this.auth.getRegisteredEmails().subscribe({
      next: (emails) => (this.emails = emails),
      error: () => (this.emails = [])
    });
  }

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: (user) => {
        this.cart.refreshCount();
       
        this.router.navigate([user.role === 'Admin' ? '/admin/users' : '/']);
      },
      error: (err) => (this.errorMessage = extractError(err, 'Login failed'))
    });
  }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.registerError = '';

    this.auth.register(this.registerName, this.registerEmail, this.registerPassword).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.signUpMode = false;
        this.registerName = this.registerEmail = this.registerPassword = '';
        this.loadEmails();
      },
      error: (err) => (this.registerError = extractError(err, 'Registration failed'))
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout().subscribe(() => {
      this.cart.resetCount();
      this.loadEmails();
    });
  }
}
