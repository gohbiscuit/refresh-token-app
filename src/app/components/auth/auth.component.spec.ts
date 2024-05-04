import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { BehaviorSubject, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let tokenServiceMock: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    const queryParamsBehaviorSubject = new BehaviorSubject<{
      code: string;
      state: string;
    }>({ code: '123', state: 'state123' });

    authServiceMock = jasmine.createSpyObj('AuthService', [
      'handleCodeExchangeAndDeleteCookie',
    ]);
    tokenServiceMock = jasmine.createSpyObj('TokenService', [
      'saveRefreshToken',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParamsBehaviorSubject.asObservable() },
        },
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

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;

    // Mocking localStorage, Stringy and Cookie changes
    spyOn(localStorage, 'getItem').and.returnValue('state123');
    spyOn(localStorage, 'setItem');
    spyOn(window, 'alert').and.stub();
    spyOn(JSON, 'stringify').and.callFake(() => '{}');
    spyOnProperty(document, 'cookie').and.returnValue('username=JohnDoe');

    fixture.detectChanges();
  });

  it('should refresh UI state on initialization', () => {
    expect(component.currentCookie).toEqual('username=JohnDoe');
    expect(component.currentLocalStorage).toEqual('{}');
  });

  it('should handle token exchange and update tokens on successful code exchange', () => {
    authServiceMock.handleCodeExchangeAndDeleteCookie.and.returnValue(
      of({
        refresh_token: 'new-refresh-token',
        access_token: 'new-access-token',
        expires_at: Date.now().toLocaleString(),
      })
    );

    component.ngOnInit();

    expect(
      authServiceMock.handleCodeExchangeAndDeleteCookie
    ).toHaveBeenCalledWith('state123', '123');
    expect(tokenServiceMock.saveRefreshToken).toHaveBeenCalledWith(
      'new-refresh-token'
    );
    expect(component.accessToken).toEqual('new-access-token');
    expect(component.refreshToken).toEqual('new-refresh-token');
  });
});
