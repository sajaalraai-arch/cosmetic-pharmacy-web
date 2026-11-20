import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiMessage, CurrentUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<CurrentUser | null>(null);
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  loadCurrentUser(): Observable<CurrentUser | null> {
    return this.http.get<CurrentUser>('/api/auth/me').pipe(
      tap((user) => this.userSubject.next(user)),
      catchError(() => {
        this.userSubject.next(null);
        return of(null);
      })
    );
  }

  getRegisteredEmails(): Observable<string[]> {
    return this.http.get<string[]>('/api/auth/emails');
  }

  login(email: string, password: string): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>('/api/auth/login', { email, password })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  register(fullName: string, email: string, password: string): Observable<ApiMessage> {
    return this.http.post<ApiMessage>('/api/auth/register', { fullName, email, password });
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(tap(() => this.userSubject.next(null)));
  }
}
