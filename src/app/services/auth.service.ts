import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TokenResponse } from '../models/token-response.model';
import { TokenService } from './token.service';
import { environment } from '../config/config';

import { PkceService } from './pcke.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private tokenService: TokenService,
    private pckeService: PkceService
  ) {}

  login(): void {
    // Generate code challenge and verifier
    const codeVerifier = this.pckeService.generateCodeVerifier();
    const codeChallenge = this.pckeService.generateCodeChallenge(codeVerifier);
    const state = this.pckeService.generateRandomString(20);
    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);
    // Save code verifier in cookie
    this.saveCodeVerifierInCookie(state, codeVerifier);
    const authorizationUrl = this.generateAuthorizationUrl(
      state,
      codeChallenge
    );
    this.redirectTo(authorizationUrl);
  }

  public redirectTo(url: string): void {
    window.location.href = url;
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

    return environment.oauthLoginUrl + `?${queryParams.toString()}`;
  }

  /* Step (3) to (5) */
  handleCodeExchangeAndDeleteCookie(
    state: string,
    code: string
  ): Observable<any> {
    console.log('handleCodeExchangeAndDeleteCookie');
    const cookieName = `app.txs.${state}`;
    // Get the value of the corresponding cookie (which is the original code_verifier)
    const codeVerifier = this.cookieService.get(cookieName);
    if (!codeVerifier) {
      throw Error(
        "Can't get tokens without the CodeVerifier. Ensure authentication has taken place."
      );
    }
    // Remove cooke so it cannot be used again
    this.cookieService.delete(cookieName);
    const codeVerifierFromLocalStorage = localStorage.getItem('codeVerifier');
    if (codeVerifier !== codeVerifierFromLocalStorage) {
      throw Error(
        'Mismatch code verifier: ' +
          codeVerifier +
          ' with local storage: ' +
          codeVerifierFromLocalStorage +
          ' something has gone wrong. Ensure authentication has taken place.'
      );
    }
    // Step (4) - Initiate a code → token exchange request
    return this.tokenService.getAccessTokenRequest(code, codeVerifier);
  }
}
