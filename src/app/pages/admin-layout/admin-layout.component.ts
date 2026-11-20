import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StyleLoaderService } from '../../core/services/style-loader.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  constructor(private styles: StyleLoaderService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
   
    this.styles.load('bootstrap-css', 'assets/vendor/bootstrap/bootstrap.min.css');
  }

  ngOnDestroy(): void {
    this.styles.unload('bootstrap-css');
  }

  signOut(event: Event): void {
    event.preventDefault();
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
