import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetails, OrderFilter, OrdersIndex } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly url = '/api/orders';

  constructor(private http: HttpClient) {}

  getAll(filter: OrderFilter = {}): Observable<OrdersIndex> {
    let params = new HttpParams();
    if (filter.searchString) params = params.set('searchString', filter.searchString);
    if (filter.statusId) params = params.set('statusId', filter.statusId);
    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate) params = params.set('toDate', filter.toDate);
    if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    if (filter.customerId) params = params.set('customerId', filter.customerId);
    return this.http.get<OrdersIndex>(this.url, { params });
  }

  getById(id: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.url}/${id}`);
  }

  updateStatus(id: number, statusId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}/status`, { statusId });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
