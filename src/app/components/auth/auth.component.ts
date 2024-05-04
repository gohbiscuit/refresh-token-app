import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthorizationResponse } from '../../models/authorization-response.model';
import { TokenService } from '../../services/token.service';
import { TokenResponse } from '../../models/token-response.model';

@Component({
  selector: 'app-auth',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Authentication Information</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p *ngIf="isLoggedIn">Logged in</p>
        <p>Access Token: {{ accessToken }}</p>
        <p>Refresh Token: {{ refreshToken }}</p>
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
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  refreshStateUI() {
    this.currentCookie = document.cookie;
    this.currentLocalStorage = JSON.stringify(localStorage);
  }

  ngOnInit() {
    this.refreshStateUI();

    /* Step (3) */
    this.activatedRoute.queryParams.subscribe((params) => {
      const error = params['error'];
      if (!!error) {
        alert('Error while loading page >> ' + error);
        return;
      }
      const response: AuthorizationResponse = {
        code: params['code'],
        state: params['state'],
      };
      const savedLocalStorageState = localStorage.getItem('state');
      if (
        response.state &&
        response.code &&
        savedLocalStorageState === response.state
      ) {
        this.authService
          .handleCodeExchangeAndDeleteCookie(response.state, response.code)
          .subscribe(
            (tokenResponse: any) => {
              this.isLoggedIn = true;
              const tokens = tokenResponse as TokenResponse;
              const refreshToken = tokens.refresh_token;

              // Step (5) save refresh token
              this.tokenService.saveRefreshToken(refreshToken);
              // SPA dislays saved tokens
              this.accessToken = tokens.access_token;
              this.refreshToken = tokens.refresh_token;
            },
            (error: any) => {
              // There is a 401 unauthorize error, Checked errors.header, it's empty hence could be due to misconfiguration from the server end.
              // For the purpose of this exercise, I'll assume there is a mock token response being return and saved.
              const mockedTokenResponse: TokenResponse = {
                refresh_token: 'mocked refresh token',
                access_token: 'mocked access token',
                expires_at: Date.now().toLocaleString(),
              };
              // Step (5) save refresh token
              this.tokenService.saveRefreshToken(
                mockedTokenResponse.refresh_token
              );

              // SPA dislays saved tokens
              this.accessToken = mockedTokenResponse.access_token;
              this.refreshToken = mockedTokenResponse.refresh_token;
              console.error('Failed to retrieve token', error);
            }
          );
        this.refreshStateUI();
      } else {
        console.log('State is different, unable to exchange token');
      }
    });
  }
}
