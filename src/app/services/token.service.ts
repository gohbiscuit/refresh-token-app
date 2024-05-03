import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient) {}

  public saveRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh_token', refreshToken);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  public clearTokens(): void {
    localStorage.clear();
  }

  public getAccessTokenRequest(
    code: string,
    codeVerifier: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    });

    // const payload = new HttpParams()
    //   .append('grant_type', 'authorization_code')
    //   .append('code', code)
    //   .append('code_verifier', codeVerifier)
    //   .append('redirect_uri', environment.redirectUrl)
    //   .append('client_id', environment.clientId);

    // const body = new URLSearchParams();
    // body.set('grant_type', 'authorization_code');
    // body.set('client_id', environment.clientId);
    // body.set('code', code);
    // body.set('redirect_uri', environment.callbackUrl);
    // body.set('code_verifier', codeVerifier);

    // const requestBody = {
    //   grant_type: 'authorization_code',
    //   client_id: environment.clientId,
    //   code: code,
    //   redirect_uri: environment.callbackUrl,
    //   code_verifier: codeVerifier,
    // };

    // "grant_type": "authorization_code",
    // "code": "<code from URL query param>"
    // "code_verifier": "<code_verifier from the corresponding cookie>"

    const requestBody = {
      grant_type: 'authorization_code',
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      code: code,
      redirect_uri: environment.redirectUrl,
      code_verifier: codeVerifier,
    };

    // return this.http.post<any>('/api/oauth/token', requestBody, {
    //   headers: headers,
    // });

    return this.http.post<any>(environment.oauthTokenUrl, requestBody, {
      headers: headers,
    });
  }

  public refreshToken(refreshToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    });
    const requestBody = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    return this.http.post<any>(environment.oauthTokenUrl, requestBody, {
      headers: headers,
    });
  }
}
