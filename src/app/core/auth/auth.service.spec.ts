import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  // Mock de un token JWT válido (solo payload base64 relevante)
  // Payload: {"sub": "Ragnar", "role": "USER", "iat": 123, "exp": 456}
  const validPayload = btoa(JSON.stringify({ sub: 'Ragnar', role: 'USER', iat: 123, exp: 456 }));
  const validToken = `header.${validPayload}.signature`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setSession', () => {
    it('setSession_givenValidToken_shouldUpdateSessionSignal', () => {
      // Ejecutar
      service.setSession(validToken);

      // Verificar
      expect(service.isLoggedIn()).toBeTrue();
      expect(service.username()).toBe('Ragnar');
      expect(service.isAdmin()).toBeFalse();
      expect(service.getToken()).toBe(validToken);
    });

    it('setSession_givenAdminToken_shouldIdentifyAsAdmin', () => {
      // Preparar
      const adminPayload = btoa(JSON.stringify({ sub: 'Odin', role: 'ADMIN', iat: 123, exp: 456 }));
      const adminToken = `header.${adminPayload}.signature`;

      // Ejecutar
      service.setSession(adminToken);

      // Verificar
      expect(service.isAdmin()).toBeTrue();
      expect(service.username()).toBe('Odin');
    });

    it('setSession_givenInvalidTokenFormat_shouldNotUpdateSession', () => {
      // Ejecutar
      service.setSession('invalid-token');

      // Verificar
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('setSession_givenMalformedBase64_shouldNotUpdateSession', () => {
      // Ejecutar
      service.setSession('header.malformed!!!base64.signature');

      // Verificar
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('clearSession', () => {
    it('clearSession_givenActiveSession_shouldResetState', () => {
      // Preparar
      service.setSession(validToken);
      expect(service.isLoggedIn()).toBeTrue();

      // Ejecutar
      service.clearSession();

      // Verificar
      expect(service.isLoggedIn()).toBeFalse();
      expect(service.username()).toBe('');
      expect(service.getToken()).toBeNull();
    });
  });

  describe('mockLogin / mockLogout', () => {
    it('mockLogin_givenDefaultRole_shouldSetUserSession', () => {
      service.mockLogin();
      expect(service.isLoggedIn()).toBeTrue();
      expect(service.isAdmin()).toBeFalse();
      expect(service.username()).toBe('Ragnar_Fury');
    });

    it('mockLogin_givenAdminRole_shouldSetAdminSession', () => {
      service.mockLogin('ADMIN');
      expect(service.isAdmin()).toBeTrue();
    });

    it('mockLogout_shouldClearSession', () => {
      service.mockLogin();
      service.mockLogout();
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('login / register (Mock Observables)', () => {
    it('login_shouldReturnObservableAndSetSession', (done) => {
      service.login('Bjorn', 'password').subscribe(() => {
        expect(service.isLoggedIn()).toBeTrue();
        expect(service.username()).toBe('Bjorn');
        done();
      });
    });

    it('register_shouldReturnObservableAndSetSession', (done) => {
      service.register('Lagertha', 'l@v.com', 'password').subscribe(() => {
        expect(service.isLoggedIn()).toBeTrue();
        expect(service.username()).toBe('Lagertha');
        done();
      });
    });
  });
});
