import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart, PlaceOrderRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly url = '/api/cart';
  private readonly countSubject = new BehaviorSubject<number>(0);


  readonly count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {}

  refreshCount(): void {
    this.http.get<number>(`${this.url}/count`).pipe(catchError(() => of(0))).subscribe((c) => this.countSubject.next(c));
  }

  resetCount(): void {
    this.countSubject.next(0);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.url).pipe(tap((c) => this.countSubject.next(c.itemsCount)));
  }

  /** يطبّق كود الخصم (أو يحذفه إذا كان النص فارغاً) ويرجع السلة مع رسالة للمستخدم. */
  applyCoupon(code: string): Observable<Cart> {
    return this.http.post<Cart>(`${this.url}/coupon`, { code });
  }

  getCheckout(): Observable<Cart> {
    return this.http.get<Cart>(`${this.url}/checkout`);
  }

  addToCart(productId: number, quantity = 1): Observable<{ success: boolean; itemsCount: number }> {
    return this.http
      .post<{ success: boolean; itemsCount: number }>(`${this.url}/items`, { productId, quantity })
      .pipe(tap((r) => this.countSubject.next(r.itemsCount)));
  }

  updateQuantity(productId: number, action: 'plus' | 'minus'): Observable<void> {
    return this.http.put<void>(`${this.url}/items/${productId}`, {}, { params: new HttpParams().set('action', action) });
  }

  removeItem(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/items/${productId}`);
  }

  placeOrder(request: PlaceOrderRequest): Observable<{ orderId: number; message: string }> {
    return this.http
      .post<{ orderId: number; message: string }>(`${this.url}/checkout`, request)
      .pipe(tap(() => this.countSubject.next(0)));
  }
}
