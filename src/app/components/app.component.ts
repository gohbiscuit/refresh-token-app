import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { TokenResponse } from '../models/token-response.model';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>
        <button mat-button>Refresh Token Application v1.0</button>
        <button mat-button class="btn-home"><mat-icon>home</mat-icon></button>
        <button mat-button class="btn-refresh-token" (click)="refreshTokens()">
          <mat-icon>gamepad</mat-icon>
          Refresh Access Token
        </button>
        <button
          *ngIf="!isLoggedIn"
          mat-button
          class="btn-login"
          (click)="login()"
        >
          <mat-icon>power_settings_new</mat-icon>
          Login
        </button>
        <button mat-button *ngIf="isLoggedIn" (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          Logout
        </button>
      </span>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      mat-card {
        max-width: 400px;
        margin: 2em auto;
        text-align: center;
      }

      .btn-refresh-token {
        width: 300px;
      }

      .btn-home {
        width: 55px;
      }

      button,
      mat-slide-toggle {
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = 'refresh-token-app';
  isLoggedIn: boolean = false;
  accessToken: string = '';
  refreshToken: string = '';

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.refreshTokens();
  }

  public login(): void {
    this.authService.login();
    this.isLoggedIn = true;
  }

  /* Step (6) */
  refreshTokens(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken) {
      this.refreshToken = refreshToken;
      this.tokenService
        .fetchAccessTokenUsingRefreshToken(refreshToken)
        .subscribe(
          (response: any) => {
            const tokens = response as TokenResponse;
            this.refreshToken = tokens.refresh_token; // new refresh token
            this.accessToken = tokens.access_token;
            const expiresAt = tokens.expires_at;

            // Replace old refresh token with new one in localStorage
            this.tokenService.saveRefreshToken(this.refreshToken);
          },
          (error: any) => {
            console.error('Failed to refresh token', error);
          }
        );
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    this.tokenService.clearTokens();
  }
}
