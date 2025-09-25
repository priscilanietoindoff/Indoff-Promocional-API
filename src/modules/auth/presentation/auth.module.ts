// src/modules/auth/presentation/auth.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';

// Controllers (lo agregaremos en el siguiente paso)
import { AuthController } from './controllers/auth.controller';

// Infra (repo / security)
import { UserPrismaRepository } from '../infraestructure/database/UserPrismaRepository';
import { BcryptPasswordHasher } from '../infraestructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../infraestructure/security/JwtTokenService';

// Domain contract
import { AUTH_USER_REPOSITORY } from '../domain/repositories/UserRepository';

// App contracts tokens
import { AUTH_PASSWORD_HASHER } from '../application/contracts/PasswordHasher';
import { AUTH_TOKEN_SERVICE } from '../application/contracts/TokenService';

// Application use case
import { Login } from '../application/services/Login';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_USER_REPOSITORY, useClass: UserPrismaRepository },
    { provide: AUTH_PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: AUTH_TOKEN_SERVICE, useClass: JwtTokenService },

    // Caso de uso
    Login,
    RolesGuard
  ],
})
export class AuthModule {}
