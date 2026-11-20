import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly url = '/api/comments';

  constructor(private http: HttpClient) {}

  getByProduct(productId: number): Observable<CommentItem[]> {
    return this.http.get<CommentItem[]>(`${this.url}/product/${productId}`);
  }


  add(productId: number, content: string, rating: number): Observable<CommentItem> {
    return this.http.post<CommentItem>(this.url, { productId, content, rating });
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
