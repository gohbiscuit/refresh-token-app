import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenResponse } from '../models/token-response.model';
import { TokenService } from './token.service';
import { environment } from '../environments/environment';

import { PkceService } from './pcke.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private tokenService: TokenService,
    private pckeService: PkceService
  ) {}

  public getCookieService(): CookieService {
    return this.cookieService;
  }

  // login(): Observable<any> {
  login(): void {
    // Generate code challenge and verifier
    const codeVerifier = this.pckeService.generateCodeVerifier();
    // this.pckeService
    //   .generateCodeChallenge(codeVerifier)
    //   .then((codeChallenge: string) => {
    //     const state = this.pckeService.generateRandomString(20);

    //     console.log('codeVerifier length >> ' + codeVerifier.length);
    //     console.log('codeChallenge length >> ' + codeChallenge.length);

    //     localStorage.setItem('state', state);
    //     localStorage.setItem('codeVerifier', codeVerifier);

    //     // Save code verifier in cookie
    //     this.saveCodeVerifierInCookie(state, codeVerifier);

    //     const authorizationUrl = this.generateAuthorizationUrl(
    //       state,
    //       codeChallenge
    //     );
    //     // Redirect to authorization server
    //     window.location.href = authorizationUrl;
    //   });

    const codeChallenge = this.pckeService.generateCodeChallenge(codeVerifier);
    // const codeChallenge = codeVerifier;
    const state = this.pckeService.generateRandomString(20);

    console.log('codeVerifier length >> ' + codeVerifier.length);
    console.log('codeChallenge length >> ' + codeChallenge.length);

    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);

    // Save code verifier in cookie
    this.saveCodeVerifierInCookie(state, codeVerifier);

    const authorizationUrl = this.generateAuthorizationUrl(
      state,
      codeChallenge
    );

    console.log('authorization Url  >> ' + authorizationUrl);

    window.location.href = authorizationUrl;
    // Redirect to authorization server
    // window.location.href = authorizationUrl;

    // Return observable for demonstration, replace with actual HTTP call
    // return new Observable<any>();
  }

  /* Step (1) */
  saveCodeVerifierInCookie(state: string, codeVerifier: string): void {
    this.saveSecureCookie(`app.txs.${state}`, codeVerifier);
  }

  saveSecureCookie(name: string, value: string) {
    this.cookieService.set(name, value, { secure: true, sameSite: 'Strict' });
  }

  /* Step (2) */
  generateAuthorizationUrl(state: string, codeChallenge: string): string {
    const queryParams = new URLSearchParams({
      response_type: 'code',
      redirect_uri: environment.redirectUrl,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      clientId: environment.clientId,
    });

    const url = environment.oauthLoginUrl + `?${queryParams.toString()}`;

    // const url = environment.oauthLoginUrl + '?' + params.join('&');
    // const url = `/api/authorize?${queryParams.toString()}`;

    // this.http.get(url).subscribe(
    //   (response) => {
    //     console.log('response is >> ', response);
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );

    return url;
  }

  /* Step 3 
  In order to handle successful authorization redirect, upon loading the webpage, the SPA should check:

  Are there state and code query params in the current URL?
  If yes, is there a corresponding cookie saved with app.txs.{state} name?
  If these both of these are true, the SPA should:

  Get the value of the corresponding cookie (which is the original code_verifier)
  Remove the cookie so it cannot be used again
  Initiate a code → token exchange request
*/
  isCookieExist(state: string): boolean {
    const cookieName = `app.txs.${state}`;
    return !!this.cookieService.get(cookieName);
  }

  handleCodeExchangeAndDeleteCookie(state: string, code: string): void {
    const cookieName = `app.txs.${state}`;
    // Get the value of the corresponding cookie (which is the original code_verifier)
    const codeVerifier = this.cookieService.get(cookieName);
    if (codeVerifier) {
      // Remove cooke so it cannot be used again
      this.cookieService.delete(cookieName);
      const codeVerifierFromLocal = localStorage.getItem('codeVerifier') ?? '';

      // Initiate a code → token exchange request
      this.tokenService
        .getAccessTokenRequest(code, codeVerifierFromLocal)
        .subscribe(
          (response: any) => {
            const tokens = response as TokenResponse;
            const refreshToken = tokens.refresh_token;
            const accessToken = tokens.access_token;
            const expiresAt = tokens.expires_at;

            this.tokenService.saveRefreshToken(refreshToken);
          },
          (error: any) => {
            console.error('Token exchange failed:', error);
          }
        );
    } else {
      // this.refreshToken();
    }
  }
}
