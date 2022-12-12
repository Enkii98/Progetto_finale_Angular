import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorites } from './Interface/favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor(private http: HttpClient) {}

  getFavorites(): Observable<Favorites[]> {
    return this.http.get<Favorites[]>('http://localhost:4201/favorites');
  }

  postFavorites(newFavorites: Partial<Favorites>) {
    return this.http.post<Favorites>(
      'http://localhost:4201/favorites',
      newFavorites
    );
  }

  deleteFavorites(id: number) {
    return this.http.delete(`http://localhost:4201/favorites/${id}`);
  }
}

