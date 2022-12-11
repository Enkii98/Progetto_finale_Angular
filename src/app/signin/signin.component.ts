import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';


@Component({
  selector: 'app-signin',
  template: `
  <h1>Submit Form</h1>
  <br>
    <form #form="ngForm" (ngSubmit)="onsubmit(form)">
      <div class="example-container">
        <div class="nc">
          <mat-form-field appearance="fill">
            <mat-label>Enter your name</mat-label>
            <input ngModel name="name" matInput placeholder="Name" required />
            <mat-error *ngIf="name.invalid">{{ getErrorMessage() }}</mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Enter your surname</mat-label>
            <input
              ngModel
              name="surname"
              matInput
              placeholder="Surname"
              required
            />
            <mat-error *ngIf="surname.invalid">{{
              getErrorMessage()
            }}</mat-error>
          </mat-form-field>
        </div>

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
            id="password"
            name="password"
            matInput
            [type]="hide ? 'password' : 'text'"
          />
          <mat-error *ngIf="password.invalid">{{
            getErrorMessage()
          }}</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Control your password</mat-label>
          <input
            matInput
            id="confirmPassword"
            name="confirmPassword"
            [type]="hide ? 'password' : 'text'"
          />
          <mat-error *ngIf="password.invalid">{{
            getErrorMessage()
          }}</mat-error>
        </mat-form-field>

        <button
          [disabled]="isLoading"
          type="submit"
          mat-raised-button
          color="warn"
        >
          Sign in
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class SigninComponent implements OnInit {
  errorMessage = undefined;
  isLoading = false;

  public signup!: FormGroup;

  constructor(
    private authSrv: UsersService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  name = new FormControl('', [Validators.required]);
  surname = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);




  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.surname.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  //password
  hide = true;

  ngOnInit(): void {}

  async onsubmit(form: NgForm) {
    this.isLoading = true;
    console.log(form);
    try {
      await this.authSrv.signup(form.value).toPromise();
      form.reset();
      alert('User successfully registered ');
      this.isLoading = false;
      this.errorMessage = undefined;
      this.router.navigate(['/login']);
    } catch (error: any) {
      form.reset();
      this.isLoading = false;
      this.errorMessage = undefined;
      alert(error);
    }
  }
}
