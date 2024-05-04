# refresh-token-app

> Authenticate against generic OAuth using PKCE
> [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.6.

[Angular Material](https://material.angular.io/)

## Install

Install all the node_modules

```bash
npm install
```

## Usage

```ts
Under config folder. Update the respective configurations if required to suit your needs.
export const environment = {
  production: false,
  clientId: 'v1.0',
  scope: 'openid profile',
  redirectUrl: 'http://localhost:4200/redirect',
  oauthLoginUrl: 'https://interview-api.vercel.app/api/authorize',
  oauthTokenUrl: 'https://interview-api.vercel.app/api/oauth/token',
};

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

export default App
```

### End User Session on "Single Application Logout"

You can end user session when calling `logout(true)`. A custom endpoint can configured by passing `logoutEndpoint` as props. The user will be redirected to the `redirectUri`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
