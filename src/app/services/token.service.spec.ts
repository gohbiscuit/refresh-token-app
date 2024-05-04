import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { of } from 'rxjs';
import { environment } from '../config/config';

describe('TokenService Tests', () => {
  let service: TokenService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(TokenService);

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue('some_refresh_token');
    spyOn(localStorage, 'clear');
  });

  it('should save refresh token to localStorage', () => {
    service.saveRefreshToken('some_refresh_token');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refresh_token',
      'some_refresh_token'
    );
  });

  it('should retrieve refresh token from localStorage', () => {
    const token = service.getRefreshToken();
    expect(localStorage.getItem).toHaveBeenCalledWith('refresh_token');
    expect(token).toEqual('some_refresh_token');
  });

  it('should clear localStorage', () => {
    service.clearTokens();
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should request access token from server', () => {
    const mockResponse = { access_token: '12345' };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service
      .getAccessTokenRequest('code123', 'verifier123')
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const requestBody = {
      grant_type: 'authorization_code',
      client_id: environment.clientId,
      code: 'code123',
      redirect_uri: environment.redirectUrl,
      code_verifier: 'verifier123',
    };
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      environment.oauthTokenUrl,
      requestBody,
      { headers: jasmine.anything() }
    );
  });

  it('should refresh token using refresh token', () => {
    const mockResponse = { access_token: 'abcde' };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.refreshToken('refresh_token123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      environment.oauthTokenUrl,
      { grant_type: 'refresh_token', refresh_token: 'refresh_token123' },
      { headers: jasmine.anything() }
    );
  });
});
