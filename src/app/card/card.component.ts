import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Film } from '../Interface/film';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';

const heart = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg>
`;

const share = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
</svg>
  `;

@Component({
  selector: 'app-card',
  template: `
  <h1>Film</h1>
  <br>
    <div class="card" *ngFor="let p of card">
      <mat-card class="example-card">
        <mat-card-header>
          <div mat-card-avatar class="example-header-image"></div>
          <mat-card-title>{{ p.title }}</mat-card-title>
          <mat-card-subtitle>Rating:{{ p.vote_average }}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [src]='p.poster_path'[alt]="p.title " />
        <mat-card-actions>
          <!-- <button mat-button> -->
            <!-- <mat-icon -->
              <!-- svgIcon="heart" -->
              <!-- aria-hidden="false" -->
              <!-- aria-label="heart SVG icon" -->
            <!-- ></mat-icon> -->
          <!-- </button> -->
          <button mat-button>
          <mat-icon
          svgIcon="share"
          aria-hidden="false"
          aria-label="share SVG icon"
          ></mat-icon>
          </button>
          <button
            mat-icon-button
            matTooltip="Warn"
            color="warn"
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

  constructor(
    private userSrv: UsersService,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral(
      'heart',
      sanitizer.bypassSecurityTrustHtml(heart)
    );

    iconRegistry.addSvgIconLiteral(
      'share',
      sanitizer.bypassSecurityTrustHtml(share)
    );
  }

  ngOnInit(): any {

    this.get();
  }

  // toggleswitch(){
    // if(color="warn" && matTooltip="Warn" ){
      // color="primary"
      // matTooltip="Primary"
    // }
  // }

  get() {
    this.http
      .get<Film[]>('http://localhost:4201/movies-popular')
      .subscribe((res) => {
        this.card = res;
      });
  }


}
