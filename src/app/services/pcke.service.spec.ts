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

  it('should generate random alphanumeric state of correct length of 20', () => {
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

  it('should encode Uint8Array to a URL-safe base64 string', () => {
    const mockArray = new Uint8Array([72, 101, 108, 108, 111]);
    const encoded = service.base64UrlEncode(mockArray);
    expect(encoded).toBe('SGVsbG8');
  });
});
