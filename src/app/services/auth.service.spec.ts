import { TestBed } from '@angular/core/testing';
import { PkceService } from './pcke.service';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../config/config';
import { TokenService } from './token.service';
import { of } from 'rxjs';

describe('AuthService Tests', () => {
  let pckeService: PkceService;
  let service: AuthService;

  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let pkceServiceSpy: jasmine.SpyObj<PkceService>;

  beforeEach(() => {
    cookieServiceSpy = jasmine.createSpyObj('CookieService', [
      'set',
      'get',
      'delete',
    ]);
    tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'getAccessTokenRequest',
      'saveRefreshToken',
    ]);
    pkceServiceSpy = jasmine.createSpyObj('PkceService', [
      'generateCodeVerifier',
      'generateCodeChallenge',
      'generateRandomString',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        AuthService,
        // { provide: CookieService, useClass: MockCookieService },
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: PkceService, useValue: pkceServiceSpy },
      ],
    });
    pckeService = TestBed.inject(PkceService);
    service = TestBed.inject(AuthService);
    // cookieService = TestBed.inject(CookieService);

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue('some_code_verifier');
    spyOn(service, 'redirectTo').and.stub(); // Spy on the new redirectTo method
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save code verifier in a secure cookie with correct key, value, secure, and SameSite=Strict settings', () => {
    const codeVerifier = 'random_code_verifier';
    const state = 'random_state';
    service.saveCodeVerifierInCookie(state, codeVerifier);
    const cookieName = `app.txs.${state}`;
    expect(cookieServiceSpy.set).toHaveBeenCalledWith(
      cookieName,
      codeVerifier,
      {
        secure: true,
        sameSite: 'Strict',
      }
    );
  });

  it('should generate authorization URL with correct parameters for response_type, redirect_uri, state, code_challenge and code_challenge_method ', () => {
    const state = 'randomState';
    const codeChallenge = 'randomCodeChallenge';

    const expectedUrl = `${
      environment.oauthLoginUrl
    }?response_type=code&redirect_uri=${encodeURIComponent(
      environment.redirectUrl
    )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&clientId=${
      environment.clientId
    }`;
    const generatedUrl = service.generateAuthorizationUrl(state, codeChallenge);
    expect(generatedUrl).toEqual(expectedUrl);
  });

  it('should initiate the login process and redirect', () => {
    const mockCodeVerifier = 'mockCodeVerifier';
    const mockCodeChallenge = 'mockCodeChallenge';
    const mockState = 'randomStateString';
    pkceServiceSpy.generateCodeVerifier.and.returnValue(mockCodeVerifier);
    pkceServiceSpy.generateCodeChallenge.and.returnValue(mockCodeChallenge);
    pkceServiceSpy.generateRandomString.and.returnValue(mockState);

    service.login();

    expect(localStorage.setItem).toHaveBeenCalledWith('state', mockState);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'codeVerifier',
      mockCodeVerifier
    );
    expect(cookieServiceSpy.set).toHaveBeenCalled();
    expect(service.redirectTo).toHaveBeenCalledWith(jasmine.any(String));
  });

  it('should handle code exchange and delete cookie', () => {
    const state = 'testState';
    const code = 'authCode';
    const codeVerifierFromCookie = 'some_code_verifier';
    cookieServiceSpy.get.and.returnValue(codeVerifierFromCookie);
    tokenServiceSpy.getAccessTokenRequest.and.returnValue(
      of({ refresh_token: 'refreshToken' })
    );

    service.handleCodeExchangeAndDeleteCookie(state, code);

    expect(cookieServiceSpy.delete).toHaveBeenCalledWith(`app.txs.${state}`);
    expect(tokenServiceSpy.getAccessTokenRequest).toHaveBeenCalledWith(
      code,
      codeVerifierFromCookie
    );
    expect(tokenServiceSpy.saveRefreshToken).toHaveBeenCalledWith(
      'refreshToken'
    );
  });

  it('should throw error if no code verifier in cookie', () => {
    const state = 'testState';
    const code = 'authCode';
    expect(() => {
      service.handleCodeExchangeAndDeleteCookie(state, code);
    }).toThrowError(
      "Can't get tokens without the CodeVerifier. Ensure authentication has taken place."
    );
  });
});
