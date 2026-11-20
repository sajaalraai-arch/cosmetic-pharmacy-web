import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { OrderFilter, OrderListItem, OrderState, OrderStats } from '../../core/models/models';
import { OrderStatusPipe } from '../../core/pipes/pipes';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-orders-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OrderStatusPipe],
  templateUrl: './orders-index.component.html',
  styleUrls: ['./orders-index.component.css']
})
export class OrdersIndexComponent implements OnInit {
  orders: OrderListItem[] = [];
  states: OrderState[] = [];
  stats: OrderStats = { totalOrders: 0, pendingOrders: 0, totalRevenue: 0, todayOrders: 0 };

  filter: OrderFilter = { searchString: '', sortOrder: '', statusId: '', fromDate: '', toDate: '', customerId: null };

  editOrderId: number | null = null;
  newStatusId: number | null = null;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
   
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    this.filter.customerId = customerId ? Number(customerId) : null;
    this.load();
  }

  load(): void {
    this.orderService.getAll(this.filter).subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.states = res.states;
        this.stats = res.stats;
      },
      error: (err) => (this.errorMessage = extractError(err))
    });
  }

  applyFilter(): void {
    this.editOrderId = null;
    this.load();
  }

  resetFilter(event: Event): void {
    event.preventDefault();
    this.filter = { searchString: '', sortOrder: '', statusId: '', fromDate: '', toDate: '', customerId: null };
    this.editOrderId = null;
    this.load();
  }

  statusClass(stateId: number): string {
    switch (stateId) {
      case 3: return 'stock-high text-success';
      case 4: return 'stock-low text-danger';
      case 1: return 'text-warning';
      default: return 'text-info';
    }
  }

  startEdit(order: OrderListItem, event: Event): void {
    event.preventDefault();
    this.editOrderId = order.orderId;
    this.newStatusId = order.orderStateId;
  }

  cancelEdit(event: Event): void {
    event.preventDefault();
    this.editOrderId = null;
  }

  updateStatus(order: OrderListItem): void {
    if (this.newStatusId === null) return;
    this.orderService.updateStatus(order.orderId, this.newStatusId).subscribe({
      next: () => {
        this.editOrderId = null;
        this.load();
      },
      error: (err) => (this.errorMessage = extractError(err))
    });
  }

  deleteOrder(order: OrderListItem): void {
    if (!confirm(`Are you sure you want to delete order #${order.orderId}?`)) return;
    this.orderService.delete(order.orderId).subscribe({
      next: () => this.load(),
      error: (err) => (this.errorMessage = extractError(err))
    });
  }
}
