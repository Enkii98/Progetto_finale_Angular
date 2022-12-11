import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  template: `
  <h1>Login Form</h1>
  <br>
    <form
      class="login"
      #form="ngForm"
      (ngSubmit)="onsubmit(form)"
      *ngIf="visible"
    >
      <div class="example-container">
        <mat-form-field appearance="fill">
          <mat-label>Enter your email</mat-label>
          <input
            ngModel
            name="email"
            matInput
            placeholder="pat@example.com"
            required
          />
          <mat-error *ngIf="email.invalid">{{ getErrorMessage() }}</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Enter your password</mat-label>
          <input
            ngModel
            name="password"
            matInput
            [type]="hide ? 'password' : 'text'"
          />
          <button
            mat-icon-button
            matSuffix
            (click)="hide = !hide"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hide"
          >
            <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>
        <p>Not registered yet?<a routerLink="/signin">Sign in</a></p>
        <button [disabled]="isLoading" mat-raised-button color="warn">
          Login
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage = undefined;
  visible = true;

  toggle() {
    this.visible = !this.visible;
  }

  constructor(private authSrv: UsersService, private router: Router,private showbutton: AppComponent) {}

  //email
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  //password
  hide = true;

  async onsubmit(form: any) {
    console.log(form);

    try {
      await this.authSrv.login(form.value).toPromise();
      form.reset();
      this.errorMessage = undefined;
      this.router.navigate(['/card']);
      this.showbutton.show=true;
    } catch (error: any) {
      form.reset();
      this.errorMessage = error;
      alert(error);
    }
  }

  ngOnInit(): void {}
}
