import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { map, take } from 'rxjs/operators';
import { UsersService } from './users.service';
import { AuthguardGuard } from './authguard.guard';
import { AuthData } from './users.service';

const menu = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
</svg>
`;

@Component({
  selector: 'app-root',
  template: `
    <mat-drawer-container class="menucontainer" autosize>
      <mat-drawer #drawer class="example-sidenav" mode="side">
        <p>Menu</p>
        <br>
        <br>
        <div>
          <button
            routerLink="/login"
            mat-raised-button
            color="warn"
          >
            Login
          </button>
          <br />
          <br />
          <button
            routerLink="/profile"
            mat-raised-button
            color="warn"
          >
            Profile
          </button>
          <br />
          <br />
          <button
            *ngIf="show"
            (click)="logout()"
            mat-raised-button
            color="warn"
          >
            Log Out
          </button>
        </div>
      </mat-drawer>

      <div class="example-sidenav-content">
        <button type="button" mat-button (click)="drawer.toggle()">
          <mat-icon
            svgIcon="menu"
            aria-hidden="false"
            aria-label="menu SVG icon"
          ></mat-icon>
        </button>
      </div>

      <router-outlet></router-outlet>
    </mat-drawer-container>
  `,
  styles: [],
})
export class AppComponent {
  title = 'movies';
  show = false;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private authSrv: UsersService,
    private guardSrv: AuthguardGuard
  ) {
    iconRegistry.addSvgIconLiteral(
      'menu',
      sanitizer.bypassSecurityTrustHtml(menu)
    );
  }

  logout() {
    confirm('Are you sure?');
    this.authSrv.logout();
    this.show = false;
  }
}
