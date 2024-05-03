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
    private http: HttpClient,
    private authService: AuthService
  ) {}

  refreshCurrentCookieAndLocalStorage() {
    this.currentCookie = document.cookie;
    this.currentLocalStorage = JSON.stringify(localStorage);
  }

  ngOnInit() {
    // this.authService.handleAuthorizationRedirect();
    console.log('AuthComponent!!');
    this.refreshCurrentCookieAndLocalStorage();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.refreshCurrentCookieAndLocalStorage();
      const error = params['error'];
      if (!!error) {
        console.error('error occurs >> ' + error);
        return;
      }
      const response: AuthorizationResponse = {
        code: params['code'],
        state: params['state'],
      };
      console.log('state is >>> ', response.state);
      console.log('code is >>> ', response.code);
      if (
        response.state &&
        response.code &&
        this.authService.isCookieExist(response.state)
      ) {
        this.authService.handleCodeExchange(response.state, response.code);
      }
    });
  }
}
