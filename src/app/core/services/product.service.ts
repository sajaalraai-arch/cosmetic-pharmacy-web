import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiMessage, ProductDetails, ProductsIndex } from '../models/models';

export interface ProductQuery {
  search?: string;
  filter?: string;
  categoryId?: number;
  categoryName?: string;
  hideExpired?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly url = '/api/products';

  constructor(private http: HttpClient) {}


    getAll(query: ProductQuery = {}): Observable<ProductsIndex> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params = params.set(key, value);
    });
    return this.http.get<ProductsIndex>(this.url, { params });
  }

  getById(id: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.url}/${id}`);
  }

  create(form: FormData): Observable<{ productId: number }> {
    return this.http.post<{ productId: number }>(this.url, form);
  }

  update(id: number, form: FormData): Observable<{ productId: number }> {
    return this.http.put<{ productId: number }>(`${this.url}/${id}`, form);
  }

  /** 204 = حُذف، 409 + canDeactivate = المنتج في طلبات سابقة، choice='deactivate' يعطّله ويحذفه من السلات بدل الحذف. */
  delete(id: number, choice?: string): Observable<ApiMessage | null> {
    let params = new HttpParams();
    if (choice) params = params.set('choice', choice);
    return this.http.delete<ApiMessage | null>(`${this.url}/${id}`, { params });
  }
}
