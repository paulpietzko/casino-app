import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface UserDetails {
  data: {
    user: {
      id: string;
      balance: number;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  private username = new BehaviorSubject<string | null>(null);
  private baseUrl = 'http://localhost:3000/api/v1/users';
  private balance: number = 0;
  private userId: string = '';

  constructor(private http: HttpClient) {}

  fetchUserDetails(): Observable<UserDetails> {
    const userId = this.getUserIdFromToken() || '';
    if (!userId) {
      console.error('Benutzer-ID konnte nicht aus dem Token abgeleitet werden.');
      return throwError(() => new Error('Benutzer-ID ist nicht vorhanden.'));
    }
  
    return this.http.get<UserDetails>(`${this.baseUrl}/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getJwtToken()}`,
      },
    });
  }

  getUserDetails(): Observable<any> {
    const userId = this.getUserIdFromToken() || '';
    if (!userId) {
      console.error(
        'Benutzer-ID konnte nicht aus dem Token abgeleitet werden.'
      );
      return of(null);
    }

    return this.http.get(`${this.baseUrl}/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getJwtToken()}`,
      },
    });
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res && res.token) {
            this.setToken(res.token);
            this.setIsAuthenticated(true);
          }
        })
      );
  }

  logout(): Observable<boolean> {
    this.removeToken();
    this.setIsAuthenticated(false);
    return of(true);
  }

  setIsAuthenticated(isAuth: boolean) {
    this.isAuthenticated.next(isAuth);
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getUserBalance(): number {
    return this.balance;
  }

  updateUserBalance(amount: number): Observable<number> {
    const userId = this.getUserIdFromToken() || '';
    const updateBalanceUrl = `${this.baseUrl}/${userId}`;
    const newBalance = this.balance + amount;
  
    return this.http.patch<{balance: number}>(updateBalanceUrl, { balance: newBalance }, {
      headers: {
        Authorization: `Bearer ${this.getJwtToken()}`
      }
    }).pipe(
      tap({
        next: (response) => {
          this.balance = response.balance;
        },
        error: (error) => {
          console.error('Fehler beim Aktualisieren der Benutzerbalance', error);
        }
      }),
      map((response: {balance: number}) => response.balance)  // Typ von `response` angegeben
    );
  }
  
  private setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', token);
    }
  }

  private getJwtToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt');
    }
    return null;
  }

  private removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
    }
  }

  private hasToken(): boolean {
    return !!this.getJwtToken();
  }

  private getUserIdFromToken(): string | null {
    const token = this.getJwtToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded?.id;
    } catch (error) {
      console.error('Fehler beim Dekodieren des JWT', error);
      return null;
    }
  }
}
