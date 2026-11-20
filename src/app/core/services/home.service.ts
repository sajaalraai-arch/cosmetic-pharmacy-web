import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData, HomeData } from '../models/models';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) {}

  getHome(): Observable<HomeData> {
    return this.http.get<HomeData>('/api/home');
  }

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>('/api/dashboard');
  }
}
