// auth.service.ts
//DOES NOT WORK CURRENTLY

import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig, JwksValidationHandler } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth() {
    const authConfig: AuthConfig = {
      issuer: 'https://secure.splitwise.com',
      redirectUri: window.location.origin,
      clientId: 'rDs8Zy7ZEmw4UTyY9Tj5kcqjpeUGllMRNFyQETaB',
      responseType: 'token',
      showDebugInformation: true // Set to false in production
    };

    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(localStorage); // Use localStorage to persist tokens
    this.oauthService.setupAutomaticSilentRefresh(); // Automatically refresh tokens
    this.oauthService.tryLogin(); // Try to login using existing tokens
  }

  login() {
    console.log("made it here 2");
    this.oauthService.initImplicitFlow(); // Initiate login flow
  }

  logout() {
    this.oauthService.logOut(); // Log out and clear tokens
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
