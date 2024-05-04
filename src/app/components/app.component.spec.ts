import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthComponent } from './auth/auth.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let tokenServiceMock: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    tokenServiceMock = jasmine.createSpyObj('TokenService', [
      'getRefreshToken',
      'refreshToken',
      'saveRefreshToken',
      'clearTokens',
    ]);

    const queryParams = new BehaviorSubject({
      code: '123',
      state: 'state123',
    });

    const activatedRouteMock = {
      queryParams: queryParams.asObservable(),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent, AuthComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      imports: [
        MatToolbarModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should refresh tokens on initialization if logged in', () => {
    component.isLoggedIn = true;
    tokenServiceMock.getRefreshToken.and.returnValue('existing-refresh-token');
    tokenServiceMock.refreshToken.and.returnValue(
      of({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_at: Date.now() + 1000,
      })
    );

    component.ngOnInit();

    expect(tokenServiceMock.getRefreshToken).toHaveBeenCalled();
    expect(tokenServiceMock.refreshToken).toHaveBeenCalledWith(
      'existing-refresh-token'
    );
    expect(component.refreshToken).toBe('new-refresh-token');
    expect(component.accessToken).toBe('new-access-token');
  });

  it('should call authService.login and set isLoggedIn to true on login', () => {
    component.login();
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should refresh tokens correctly', () => {
    const refreshToken = 'old-refresh-token';
    const newTokens = {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      expires_at: Date.now() + 1000,
    };
    tokenServiceMock.getRefreshToken.and.returnValue(refreshToken);
    tokenServiceMock.refreshToken.and.returnValue(of(newTokens));

    component.refreshTokens();

    expect(tokenServiceMock.refreshToken).toHaveBeenCalledWith(refreshToken);
    expect(component.refreshToken).toEqual('new-refresh-token');
    expect(component.accessToken).toEqual('new-access-token');
    expect(tokenServiceMock.saveRefreshToken).toHaveBeenCalledWith(
      'new-refresh-token'
    );
  });

  it('should handle errors in token refresh', () => {
    tokenServiceMock.getRefreshToken.and.returnValue('refresh-token');
    tokenServiceMock.refreshToken.and.returnValue(
      throwError(() => new Error('Failed to refresh token'))
    );

    component.refreshTokens();

    expect(component.refreshToken).toBe('');
    expect(component.accessToken).toBe('');
  });

  it('should clear tokens and reset login state on logout', () => {
    component.logout();

    expect(component.isLoggedIn).toBeFalse();
    expect(tokenServiceMock.clearTokens).toHaveBeenCalled();
  });
});
