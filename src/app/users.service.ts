import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Film } from './Interface/film';
import { catchError, map } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject, BehaviorSubject,throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObserversModule } from '@angular/cdk/observers';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

export interface SignupData {
  name: string;
  surname: string;
  email: string;
  password: string;
}
export interface AuthData {
  accessToken: string;
  user: {
    email: string;
    id: number;
    name: string;
    surname: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  jwtHelper = new JwtHelperService();

  URL = 'http://localhost:4201';
  private authSubject = new BehaviorSubject<null | AuthData>(null);
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map((user) => !!user));

  autologoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.URL}/login`, data).pipe(
      tap((val) => {
        console.log(val);
      }),
      tap((data) => {
        this.authSubject.next(data);
        localStorage.setItem('user', JSON.stringify(data));
        const expirationDate = this.jwtHelper.getTokenExpirationDate(
          data.accessToken
        ) as Date;
        this.autoLogut(expirationDate);
      }),
      catchError(this.errors)
    );
  }

  restoreUser() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    }
    const user: AuthData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(user.accessToken)) {
      return;
    }
    this.authSubject.next(user);
    const expirationDate = this.jwtHelper.getTokenExpirationDate(
      user.accessToken
    ) as Date;
    this.autoLogut(expirationDate);
  }

  signup(data: SignupData) {
    console.log(data);
    return this.http
      .post(`${this.URL}/users`, data)
      .pipe(catchError(this.errors));
  }

  logout() {
    this.authSubject.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
    if (this.autologoutTimer) {
      clearTimeout(this.autologoutTimer);
    }
  }

  autoLogut(expirationDate: Date) {
    const expMs = expirationDate.getTime() - new Date().getTime();
    this.autologoutTimer = setTimeout(() => {
      this.logout();
    }, expMs);
  }

  private errors(err: any) {
    // console.error(err)
    switch (err.error) {
      case 'Email and password are required':
        return throwError('Email and password are required');
        break;
      case 'Email already exists':
        return throwError('Email already exists');
        break;
      case 'Email format is invalid':
        return throwError('Email format is invalid');
        break;
      case 'Cannot find user':
        return throwError('Cannot find user');
        break;

      case 'Unauthorized':
        return throwError('Unauthorized');
        break;

      default:
        return throwError('Call error');
        break;
    }
  }
}
