import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthorizationResponse } from '../../models/authorization-response.model';

@Component({
  selector: 'app-auth',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Authentication Information</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p *ngIf="isLoggedIn">Logged in</p>
        <!-- <div *ngIf="isLoggedIn"> -->
        <p>Access Token: {{ accessToken }}</p>
        <p>Refresh Token: {{ refreshToken }}</p>
        <!-- </div> -->
      </mat-card-content>
    </mat-card>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Storage and Cookies</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Local Storage: {{ currentLocalStorage | json }}</p>
        <p>Cookies: {{ currentCookie }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 1200px;
        width: 100%;
        margin-top: 100px;
      }
    `,
  ],
})
export class AuthComponent implements OnInit {
  currentCookie: string | undefined;
  currentLocalStorage: string | undefined;

  @Input() isLoggedIn: boolean = false;
  @Input() accessToken: string = '';
  @Input() refreshToken: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  refreshStateUI() {
    this.currentCookie = document.cookie;
    this.currentLocalStorage = JSON.stringify(localStorage);
  }

  ngOnInit() {
    this.refreshStateUI();

    this.activatedRoute.queryParams.subscribe((params) => {
      const error = params['error'];
      if (!!error) {
        console.error('AuthComponent error occurs on load>> ' + error);
        return;
      }
      const response: AuthorizationResponse = {
        code: params['code'],
        state: params['state'],
      };
      console.log('state is >>> ', response.state);
      console.log('code is >>> ', response.code);
      const savedLocalStorageState = localStorage.getItem('state');

      if (
        response.state &&
        response.code &&
        savedLocalStorageState === response.state
      ) {
        this.authService.handleCodeExchangeAndDeleteCookie(
          response.state,
          response.code
        );
        this.refreshStateUI();
      } else {
        console.log(
          'different state > ' +
            response.state +
            '   vs local storage ' +
            savedLocalStorageState
        );
      }
    });
  }
}
