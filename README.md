# refresh-token-app

> Authenticate against generic OAuth using PKCE
> [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.6 and [Angular Material](https://material.angular.io/)

## Pre Requisite

Recommended to install the following tools for this project

1. [Visual Studio Code](https://code.visualstudio.com/) IDE
2. [NodeJS] (https://nodejs.org/en) recommended version v20.12.2

## Install

Install all the node_modules

```bash
npm install
```

## Usage

Under `config` folder. Update the respective configurations if required to suit your needs.

```ts
export const environment = {
  clientId: 'v1.0',
  scope: 'openid profile',
  redirectUrl: 'http://localhost:4200/redirect',
  oauthLoginUrl: 'https://interview-api.vercel.app/api/authorize',
  oauthTokenUrl: 'https://interview-api.vercel.app/api/oauth/token',
};

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
```

`redirectUri`: Url of the application should redirect to after `/authorize` with the Auth Server.

`clientId` Id of the application

`oauthLoginUrl` Authorization Url of the Authentication Server

`oauthTokenUrl` Token Access Url of the Authentication Server

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
