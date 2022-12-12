import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from './Interface/film';

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  constructor(private http: HttpClient) {}

  film(): Observable<Film[]> {
    return this.http.get<Film[]>('http://localhost:4201/movies-popular');
  }
}
