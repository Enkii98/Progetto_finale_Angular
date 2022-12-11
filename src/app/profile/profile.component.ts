import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { AppComponent } from '../app.component';
import { AuthData } from '../users.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  template: `<div *ngFor="let p of profile"><p>{{p.user.name}}</p></div>`,
  styles: [],
})
export class ProfileComponent implements OnInit {
  URL = 'http://localhost:4201';
  profile: AuthData[] | undefined;

  constructor(private authSrv: UsersService, private http: HttpClient) {}

  ngOnInit(): void {
    this.login();
  }

  login() {
    this.http.get<AuthData[]>(`${this.URL}/users`).subscribe((res) => {
      this.profile = res;
    });
  }
}
