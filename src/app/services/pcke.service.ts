import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class PkceService {
  generateRandomString(length: number): string {
    // Generate random alphanumeric string
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateCodeVerifier(): string {
    return this.generateRandomString(43);
  }

  // async generateCodeChallenge(codeVerifier: string): Promise<string> {
  //   const encoded = new TextEncoder().encode(codeVerifier);
  //   const hashed = await crypto.subtle.digest('SHA-256', encoded);
  //   return this.base64UrlEncode(new Uint8Array(hashed));
  // }

  base64UrlEncode(arrayBuffer: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, arrayBuffer as any))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Generate code challenge based on code verifier
  generateCodeChallenge(codeVerifier: string): string {
    const hash = CryptoJS.SHA256(codeVerifier);
    const base64Encoded = CryptoJS.enc.Base64.stringify(hash);
    return base64Encoded
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(
    //   CryptoJS.enc.Base64
    // );
    // const codeChallenge = codeVerifierHash
    //   .replace(/=/g, '')
    //   .replace(/\+/g, '-')
    //   .replace(/\//g, '_');
    // return codeChallenge;
  }

  // base64URLEncode(str: string): string {
  //   return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // }
}
