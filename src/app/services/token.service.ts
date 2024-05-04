import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response.model';
import { environment } from '../config/config';

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

    const requestBody = {
      grant_type: 'authorization_code',
      client_id: environment.clientId,
      // client_secret: environment.clientSecret,
      scope: environment.scope,
      code: code,
      redirect_uri: environment.redirectUrl,
      code_verifier: codeVerifier,
    };

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
