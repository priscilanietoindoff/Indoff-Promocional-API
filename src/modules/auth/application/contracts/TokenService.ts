// Contrato de la capa Application para manejo de tokens
export interface AccessTokenPayload {
  sub: string;            // userId
  role: 'USER' | 'ADMIN';
  email: string;          // 👈 agregado
  iat?: number;           // issued at (lo agrega JWT)
  exp?: number;           // expiry (lo agrega JWT)
}

export interface TokenService {
  generateAccessToken(user: {
    id: string;
    role: 'USER' | 'ADMIN';
    email: string;
  }): Promise<string>;

  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
}

// Token para inyección de dependencias
export const AUTH_TOKEN_SERVICE = Symbol('AUTH_TOKEN_SERVICE');

