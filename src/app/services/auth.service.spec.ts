import { TestBed } from '@angular/core/testing';
import { PkceService } from './pcke.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';

class MockCookieService {
  set = jasmine.createSpy('set');
}

describe('AuthService Tests', () => {
  let pckeService: PkceService;
  let service: AuthService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: CookieService, useClass: MockCookieService },
      ],
    });
    pckeService = TestBed.inject(PkceService);
    service = TestBed.inject(AuthService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save code verifier in a secure cookie with correct key, value, secure, and SameSite=Strict settings', () => {
    const codeVerifier = 'random_code_verifier';
    const state = 'random_state';
    service.saveCodeVerifierInCookie(state, codeVerifier);
    const cookieName = `app.txs.${state}`;
    expect(cookieService.set).toHaveBeenCalledWith(cookieName, codeVerifier, {
      secure: true,
      sameSite: 'Strict',
    });
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
});
