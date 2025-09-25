/**
 * Contrato para comparar contraseñas en texto plano vs hashes almacenados.
 * La implementación concreta puede ser bcrypt o argon2 (en Infrastructure).
 */
export interface PasswordHasher {
  compare(plain: string, hash: string): Promise<boolean>;
}

/**
 * Token de inyección para PasswordHasher.
 * En el módulo: { provide: AUTH_PASSWORD_HASHER, useClass: BcryptPasswordHasher }
 */
export const AUTH_PASSWORD_HASHER = Symbol('AUTH_PASSWORD_HASHER');
