import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Film } from '../Interface/film';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { Favorites } from '../Interface/favorites';
import { FavoritesService } from '../favourite-films.service';
import { FilmsService } from '../films.service';


const share = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
</svg>
  `;

@Component({
  selector: 'app-card',
  template: `
    <h1>Film</h1>
    <br />
    <div class="card" *ngFor="let p of card">
      <mat-card class="example-card">
        <mat-card-header>
          <div mat-card-avatar class="example-header-image"></div>
          <mat-card-title>{{ p.title }}</mat-card-title>
          <mat-card-subtitle>Rating:{{ p.vote_average }}</mat-card-subtitle>
        </mat-card-header>
        <img
          mat-card-image
          src="http://image.tmdb.org/t/p/w500/{{p.poster_path}}"
          [alt]="p.title"
        />
        <mat-card-actions>
          <button mat-button>
            <mat-icon
              svgIcon="share"
              aria-hidden="false"
              aria-label="share SVG icon"
            ></mat-icon>
          </button>
          <button
            (click)="like(p.id, $event)"
            color="{{ p.like ? 'warn' : 'basic' }}"
            truecolor
            mat-icon-button
            aria-label="Example icon-button with a heart icon"
          >
            <mat-icon>favorite</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [],
})
export class CardComponent implements OnInit {
  sub!: Subscription;
  card: Film[] | undefined;
  favorites: Favorites[] | undefined;
  userdata: any = [];

  constructor(
    private filmSrv: FilmsService,
    private favSrv: FavoritesService,
    private userSrv: UsersService,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral(
      'share',
      sanitizer.bypassSecurityTrustHtml(share)
    );
  }

  ngOnInit(): any {
    this.getfilms();
    this.user();
    this.myfav();
  }

  getfilms() {
    this.sub = this.filmSrv.film().subscribe((ris) => {
      this.card = ris;
    });
  }

  myfav() {
    this.filmSrv.film().subscribe((movies) => {
      this.card = movies;
      if (this.userdata.user.id !== null) {
        this.favSrv.getFavorites().subscribe((fav) => {
          this.card = this.card!.map((movie) => {
            if (
              fav.find(
                (value) =>
                  value.movieId === movie.id &&
                  value.userId === this.userdata.user.id
              )
            ) {
              movie.like = true;
              movie.userId = this.userdata.user.id;
            }
            return movie;
          });
        });
      }
    });
  }

  user() {
    let userLogged: any = localStorage.getItem('user');
    this.userdata = JSON.parse(userLogged);
  }

  like(movie: any, event: any) {
    this.sub = this.favSrv.getFavorites().subscribe((ris) => {
      this.favorites = ris;

      if (
        ris.find(
          (item) =>
            item.movieId === movie && item.userId === this.userdata.user.id
        )
      ) {
        const item = ris.find(
          (item) =>
            item.movieId === movie && item.userId === this.userdata.user.id
        );
        const id = item ? item.id : undefined;

        this.sub = this.favSrv.deleteFavorites(id!).subscribe((ris) => {
          console.log('Item has been deleted');
        });
      } else {
        let newFavorite: {
          movieId: number;
          userId: number;
        } = {
          movieId: movie,
          userId: this.userdata.user.id,
        };
        this.sub = this.favSrv.postFavorites(newFavorite).subscribe((ris) => {
          console.log('Item has been added');
        });
      }
    });
  }
}
