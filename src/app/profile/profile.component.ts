import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { AppComponent } from '../app.component';
import { AuthData } from '../users.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FavoritesService } from '../favourite-films.service';


@Component({
  selector: 'app-profile',
  template: `
    <mat-card class="profile-card">
      <mat-card-header>
        <mat-card-title>Name: {{ user.user.name }}</mat-card-title>
        <mat-card-subtitle>Surname: {{ user.user.surname }}</mat-card-subtitle>
        <mat-card-subtitle>Email: {{ user.user.email }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-actions>
        <button mat-raised-button color="warn" routerLink="/card">Film</button>
        <button mat-raised-button color="warn" (click)="logout()">
          Log Out
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  user: any = [];

  constructor(private authSrv: UsersService,private favSrv: FavoritesService) {}

  ngOnInit(): void {
    let userLogger: any = localStorage.getItem('user');
    this.user = JSON.parse(userLogger);
    console.log(userLogger);
  }


  logout() {
    confirm('Are you sure?');
    this.authSrv.logout();
  }
}
