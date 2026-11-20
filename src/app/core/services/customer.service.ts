import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomersIndex } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly url = '/api/customers';

  constructor(private http: HttpClient) {}

  getAll(searchTerm?: string, role?: string, status?: string): Observable<CustomersIndex> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (role) params = params.set('role', role);
    if (status) params = params.set('status', status);
    return this.http.get<CustomersIndex>(this.url, { params });
  }

  create(fullName: string, email: string, userRole: string, userStatus: string): Observable<Customer> {
    return this.http.post<Customer>(this.url, { fullName, email, userRole, userStatus });
  }

  update(id: number, fullName: string, email: string, userRole: string, userStatus: string): Observable<Customer> {
    return this.http.put<Customer>(`${this.url}/${id}`, { fullName, email, userRole, userStatus });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
