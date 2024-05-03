import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [CommonModule], // Include CommonModule if using common directives
  template: `
    <mat-toolbar color="primary">
      <span>
        <button mat-button>Refresh Token Application v1.0</button>
        <button mat-button class="btn-home"><mat-icon>home</mat-icon></button>
        <button mat-button class="btn-refresh-token">
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
    <app-auth
      [isLoggedIn]="isLoggedIn"
      [accessToken]="accessToken"
      [refreshToken]="refreshToken"
    ></app-auth>
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
  title = 'refresh-token-app'; // Define the property here
  isLoggedIn: boolean = false;
  accessToken: string = '';
  refreshToken: string = '';

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    // const str = location.href.replace(location.search, '');
    // console.log('str is >> ', str);
    if (this.isLoggedIn) {
      this.accessToken = this.tokenService.getAccessToken() ?? '';
      this.refreshToken = this.tokenService.getRefreshToken() ?? '';
    }
  }

  // refreshTokenIfNeeded() {
  //   if (!this.authService.isLoggedIn().getValue()) {
  //     this.authService.refreshToken().subscribe({
  //       next: (token) => {
  //         console.log('Token refreshed successfully', token);
  //       },
  //       error: (error) => {
  //         console.error('Failed to refresh token', error);
  //       },
  //     });
  //   }
  // }

  public login(): void {
    // Initiate login process
    // this.authService.login().subscribe((response) => {
    //   // Update tokens after successful login
    //   console.log('login success');
    //   this.accessToken = response.access_token;
    //   this.refreshToken = response.refresh_token;
    //   this.isLoggedIn = true;

    //   this.tokenService.saveRefreshToken(this.refreshToken);
    //   this.tokenService.saveAccessToken(this.accessToken);

    //   console.log('accessToken', this.accessToken);
    //   console.log('refreshToken', this.refreshToken);
    // });
    console.log('handle Login!!!');
    this.authService.login();
    this.isLoggedIn = true;
    this.accessToken = this.tokenService.getAccessToken() ?? '';
    this.refreshToken = this.tokenService.getRefreshToken() ?? '';
  }

  // refreshTokens(): void {
  //   if (this.refreshToken) {
  //     this.tokenService.refreshToken(this.refreshToken).subscribe(
  //       (response) => {
  //         const tokens = response as TokenResponse;
  //         this.refreshToken = response.refresh_token;
  //         this.accessToken = response.access_token;
  //         const expiresAt = response.expires_at;

  //         // Replace old refresh token with new one in localStorage
  //         this.tokenService.saveRefreshToken(this.refreshToken);

  //         // Display or use access token as needed
  //         console.log('Access Token:', this.accessToken);
  //         console.log('Expires At:', expiresAt);
  //       },
  //       (error) => {
  //         console.error('Token refresh failed:', error);
  //       }
  //     );
  //   }
  // }

  logout(): void {
    localStorage.clear();
    // this.authService.logout();
  }
}
