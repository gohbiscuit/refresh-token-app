import { TestBed } from '@angular/core/testing';
import { PkceService } from './pcke.service';

describe('PkceService Tests', () => {
  let service: PkceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PkceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate random alphanumeric state of length 20', () => {
    const state = service.generateRandomString(20);
    expect(state.length).toBe(20);
    const regex = /^[a-zA-Z0-9-]*$/;
    expect(regex.test(state)).toBeTruthy();
  });

  it('should generate random alphanumeric code verifier of length 43', () => {
    const codeVerifier = service.generateCodeVerifier();
    const regex = /^[a-zA-Z0-9]*$/;
    expect(regex.test(codeVerifier)).toBeTruthy();
    expect(codeVerifier.length).toBe(43);
  });

  it('should generate random alphanumeric with hyphen code challenge of length 43', () => {
    const codeChallenge = service.generateCodeChallenge('random_code_verifier');
    expect(codeChallenge.length).toBe(43);
    const regex = /^[a-zA-Z0-9-]*$/;
    expect(regex.test(codeChallenge)).toBeTruthy();
  });

  // Additional test to ensure the base64url encoding is done correctly
  // it('should properly encode in base64url format', () => {
  //   const input = new Uint8Array([43, 47, 61]); // Corresponds to '+/='
  //   const result = service.base64UrlEncode(input);
  //   expect(result).toEqual('K_Lw'); // Expected base64url output without '+', '/', and '='
  // });
});
