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

  it('should generate a code verifier of 43 characters length', () => {
    const codeVerifier = service.generateCodeVerifier();
    expect(codeVerifier).toBeTruthy();
    expect(codeVerifier.length).toBe(43);
  });

  it('should generate a valid code challenge from the code verifier', async () => {
    const codeVerifier = service.generateCodeVerifier();
    const codeChallenge = await service.generateCodeChallenge(codeVerifier);
    expect(codeChallenge).toBeTruthy();
    // Additional tests can be done to check the format of the code challenge
  });

  // Additional test to ensure the base64url encoding is done correctly
  it('should properly encode in base64url format', () => {
    const input = new Uint8Array([43, 47, 61]); // Corresponds to '+/='
    const result = service.base64UrlEncode(input);
    expect(result).toEqual('K_Lw'); // Expected base64url output without '+', '/', and '='
  });
});
