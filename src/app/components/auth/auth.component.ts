import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthorizationResponse } from '../../models/authorization-response.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: [],
})
export class AuthComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.authService.handleAuthorizationRedirect();
    console.log('AuthComponent!!');
    this.activatedRoute.queryParams.subscribe((params) => {
      const error = params['error'];
      if (!!error) {
        console.error('error occurs >> ' + error);
        return;
      }

      const response: AuthorizationResponse = {
        code: params['code'],
        state: params['state'],
      };
      console.log('state is >>> ', response.state);
      console.log('code is >>> ', response.code);

      if (
        response.state &&
        response.code &&
        this.authService.isCookieExist(response.state)
      ) {
        this.authService.handleCodeExchange(response.state, response.code);
      }
    });
  }
}
