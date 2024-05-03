import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TokenService } from './services/token.service';
import { TokenResponse } from './models/token-response.model';

@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [CommonModule], // Include CommonModule if using common directives
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
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
      // Get tokens from localStorage
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

  login() {
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

    this.authService.login();
  }

  refreshTokens(): void {
    if (this.refreshToken) {
      this.tokenService.refreshToken(this.refreshToken).subscribe(
        (response) => {
          const tokens = response as TokenResponse;
          this.refreshToken = response.refresh_token;
          this.accessToken = response.access_token;
          const expiresAt = response.expires_at;

          // Replace old refresh token with new one in localStorage
          this.tokenService.saveRefreshToken(this.refreshToken);

          // Display or use access token as needed
          console.log('Access Token:', this.accessToken);
          console.log('Expires At:', expiresAt);
        },
        (error) => {
          console.error('Token refresh failed:', error);
        }
      );
    }
  }

  logout() {
    localStorage.clear();
    // this.authService.logout();
  }
}
