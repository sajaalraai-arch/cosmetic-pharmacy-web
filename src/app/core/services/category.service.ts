import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiMessage, Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly url = '/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  create(form: FormData): Observable<Category> {
    return this.http.post<Category>(this.url, form);
  }

  update(id: number, form: FormData): Observable<Category> {
    return this.http.put<Category>(`${this.url}/${id}`, form);
  }


  delete(id: number): Observable<ApiMessage | null> {
    return this.http.delete<ApiMessage | null>(`${this.url}/${id}`);
  }
}
