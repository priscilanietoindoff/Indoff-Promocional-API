import type { User } from '../entities/User';

/**
 * Contrato del repositorio de usuarios para la capa de aplicación.
 * La implementación concreta (Prisma, etc.) vivirá en Infrastructure.
 */
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;

  //Crear nuevo usuario por defecto con role de USER y isVerified false
  create(data: {
    email: string;
    passwordHash: string;
    firstName?: string | null;
    lastName?: string | null;
    role?: 'USER'|'ADMIN';
    isVerified?: boolean;
  }): Promise<User>;

  markVerified(userId: string): Promise<void>;
}

/**
 * Token de inyección para desacoplar Application de la implementación concreta.
 * En el módulo: { provide: AUTH_USER_REPOSITORY, useClass: UserPrismaRepository }
 * En services: constructor(@Inject(AUTH_USER_REPOSITORY) private readonly users: UserRepository) {}
 */
export const AUTH_USER_REPOSITORY = Symbol('AUTH_USER_REPOSITORY');
