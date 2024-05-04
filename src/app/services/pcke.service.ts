import { Injectable } from '@angular/core';
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

  base64UrlEncode(arrayBuffer: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, arrayBuffer as any))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  generateCodeChallenge(codeVerifier: string): string {
    const hash = CryptoJS.SHA256(codeVerifier);
    const base64Encoded = CryptoJS.enc.Base64.stringify(hash);
    return base64Encoded
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
