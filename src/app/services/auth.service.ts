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

    // const codeChallenge = this.pckeService.generateCodeChallenge(codeVerifier);

    // const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(
    //   CryptoJS.enc.Base64
    // );

    // const codeChallenge = codeVerifierHash
    //   .replace(/=/g, '')
    //   .replace(/\+/g, '-')
    //   .replace(/\//g, '_');

    const codeChallenge = this.pckeService.generateCodeChallenge(codeVerifier);

    console.log('codeVerifier length >> ' + codeVerifier.length);
    console.log('codeChallenge length >> ' + codeChallenge.length);

    const state = this.pckeService.generateRandomString(20);

    // const state = this.strRandom(40);
    // const codeVerifier = this.strRandom(128);

    // this.storage.set('state', state);
    // this.storage.set('codeVerifier', codeVerifier);

    // const codeChallenge = codeVerifier;

    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);

    // Save code verifier in cookie
    this.saveCodeVerifierInCookie(state, codeVerifier);

    const authorizationUrl = this.generateAuthorizationUrl(
      state,
      codeChallenge
    );
    // Redirect to authorization server
    window.location.href = authorizationUrl;

    // Return observable for demonstration, replace with actual HTTP call
    // return new Observable<any>();
  }

  /*
  (1) Generating code challenge and verifier in TypeScript
code_verifier and code_challenge should be a random alphanumerical strings, each 43 characters long.
Saving code verifier in cookie

The cookie key should be app.txs.{{state}}, where state is a random 20 character long alphanumerical string.
The cookie value should be the code_verifier.
The cookie should be secure and have SameSite=Strict setting (refer to docs here).
Example:

app.txs.1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed=jrGC_EwW.3P22CJ3XydPw_1~36Pxu2Xy8rB1aP4V6Q1
*/
  // generateCodeVerifier(): string {
  //   return this.generateRandomString(43);
  // }

  // async generateCodeChallenge(codeVerifier: string): Promise<string> {
  //   const buffer = new TextEncoder().encode(codeVerifier);
  //   const hash = await crypto.subtle.digest('SHA-256', buffer);
  //   return btoa(
  //     String.fromCharCode.apply(null, Array.from(new Uint8Array(hash)))
  //   )
  //     .replace(/\+/g, '-')
  //     .replace(/\//g, '_')
  //     .replace(/=+$/, '');
  // }

  saveCodeVerifierInCookie(state: string, codeVerifier: string): void {
    // Save code verifier in cookie
    // const cookieValue = encodeURIComponent(codeVerifier);
    // console.log(`app.txs.${state}=${cookieValue}`);
    // document.cookie = `app.txs.${state}=${cookieValue}; Secure; SameSite=Strict`;

    const cookieKey = `app.txs.${state}`;
    this.cookieService.set(cookieKey, codeVerifier, {
      secure: true,
      sameSite: 'Strict' as 'Strict' | 'Lax' | 'None',
    });
  }

  // generateRandomString(length: number): string {
  //   // Generate random alphanumeric string
  //   const chars =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let result = '';
  //   for (let i = 0; i < length; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // }

  /* Step 2 
    Once the user presses the "Login" button, the app should redirect to: <authorization-server>/authorize with the following query params:

    response_type: code,id_token
    redirect_uri: the URL your SPA is accessible. In local development cases, this will be most likely http://localhost.
    state: the same state you generated above for the cookie
    code_challenge: the code_challenge you generated above
*/

  generateAuthorizationUrl(state: string, codeChallenge: string): string {
    // 'response_type=code',
    // 'state=' + state,
    // 'client_id=' + environment.oauthClientId,
    // 'scope=read_user_data write_user_data',

    // const queryParams = new URLSearchParams({
    //   response_type: 'code',
    //   // redirect_uri: environment.callbackUrl,
    //   redirect_uri: environment.redirectUrl,
    //   state,
    //   code_challenge: codeChallenge,
    //   code_challenge_method: 'S256',
    //   clientId: environment.clientId,
    //   // scope: 'read_user_data write_user_data',
    // });

    // https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id={your_client_id}&redirect_uri=https%3A%2F%2Flocalhost%3A8888&&response_type=code&code_challenge={generated code_challenge value}&code_challenge_method={S256}&state=235o250eddsdff&scope={contact_data%20campaign_data%20offline_access}

    // const url = `https://your-auth-server.com/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}`

    const params = [
      'response_type=code id_token',
      'state=' + state,
      // 'client_id=' + environment.clientId,
      // 'scope=read_user_data write_user_data',
      'code_challenge=' + codeChallenge,
      'code_challenge_method=S256', // By default it is plain
      // 'scope=offline_access',
      'redirect_uri=' + environment.redirectUrl,
    ];

    const url = environment.oauthLoginUrl + '?' + params.join('&');
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
  // handleAuthorizationRedirect(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     const state = params['state'];
  //     const code = params['code'];
  //     console.log('state is >>> ', state);
  //     console.log('code is >>> ', code);

  //     if (state && code && this.isCookieExist(state)) {
  //       alert('handle code exchange');
  //       this.handleCodeExchange(state, code);
  //     }
  //   });
  // }

  isCookieExist(state: string): boolean {
    const cookieName = `app.txs.${state}`;
    return !!this.cookieService.get(cookieName);
  }

  handleCodeExchange(state: string, code: string): void {
    const cookieName = `app.txs.${state}`;
    const codeVerifier = this.cookieService.get(cookieName);
    console.log('code Verifier is >> ' + codeVerifier);
    if (codeVerifier) {
      console.log('deleting cookie name >> ' + cookieName);
      this.cookieService.delete(cookieName);

      if (state !== localStorage.getItem('state')) {
        alert('Invalid state');
        return;
      }

      // const codez = localStorage.getItem('codeVerifier') ?? '';

      // this.tokenService.initiateCodeTokenExchangeRequest(code, codeVerifier);
      this.tokenService.getAccessTokenRequest(code, codeVerifier).subscribe(
        (response: any) => {
          // const tokens = response as TokenResponse;
          // const refreshToken = tokens.refresh_token;
          // const accessToken = tokens.access_token;
          // const expiresAt = tokens.expires_at;

          // // Display tokens on the page or store them as needed
          // console.log('Refresh Token:', refreshToken);
          // console.log('Access Token:', accessToken);
          // console.log('Expires At:', expiresAt);

          // this.tokenService.saveRefreshToken(refreshToken);

          console.log(response);
        },
        (error: any) => {
          console.error('Token exchange failed:', error);
          console.log(error.response);
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // this.refreshToken();
          }
        }
      );
    } else {
      // this.refreshToken();
    }
  }

  refreshToken(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    console.log('refresh token is >> ' + refreshToken);
    if (refreshToken) {
      this.tokenService.refreshToken(refreshToken).subscribe(
        (response) => {
          const tokens = response as TokenResponse;
          const newRefreshToken = response.refresh_token;
          const accessToken = response.access_token;
          const expiresAt = response.expires_at;

          // Replace old refresh token with new one in localStorage
          this.tokenService.saveRefreshToken(newRefreshToken);

          // Display or use access token as needed
          console.log('Access Token:', accessToken);
          console.log('Expires At:', expiresAt);
        },
        (error: any) => {
          console.error('Token refresh failed:', error);
        }
      );
    }
  }
}
