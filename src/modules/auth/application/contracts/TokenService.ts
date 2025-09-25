/**
 * Payload mínimo para un Access Token (JWT u otro mecanismo).
 * Mantenerlo genérico permite cambiar la lib sin tocar Application.
 */
export interface AccessTokenPayload {
  sub: string;   // userId
  role: string;  // 'USER' | 'ADMIN'
  iat?: number;  // issued-at (opcional)
  exp?: number;  // expiration (opcional)
}

/**
 * Contrato para firmar tokens de acceso de vida corta.
 * La verificación se usará en los Guards (Presentation), no aquí.
 */
export interface TokenService {
  signAccess(payload: AccessTokenPayload, ttlSeconds: number): Promise<string>;
}

/**
 * Token de inyección para TokenService.
 * En el módulo: { provide: AUTH_TOKEN_SERVICE, useClass: JwtTokenService }
 */
export const AUTH_TOKEN_SERVICE = Symbol('AUTH_TOKEN_SERVICE');
