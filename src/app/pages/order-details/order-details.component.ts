import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { OrderDetails } from '../../core/models/models';
import { ImgUrlPipe, OrderStatusPipe } from '../../core/pipes/pipes';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ImgUrlPipe, OrderStatusPipe],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: OrderDetails | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orderService.getById(Number(params.get('id'))).subscribe({
        next: (o) => (this.order = o),
        error: () => this.router.navigate(['/admin/orders'])
      });
    });
  }

  badgeClass(stateId: number): string {
    switch (stateId) {
      case 3: return 'bg-success';
      case 1: return 'bg-warning text-dark';
      case 4: return 'bg-danger';
      default: return 'bg-info text-white';
    }
  }
}
