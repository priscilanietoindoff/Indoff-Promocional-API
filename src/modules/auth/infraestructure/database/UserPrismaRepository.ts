// Archivo para la conexión entre Prisma y el dominio, entrega Entities (Dominio).
// Los DTOs se crean en Application.

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

// Contrato de Domain
import {
  type UserRepository,
} from '../../domain/repositories/UserRepository';

// Entity del dominio
import type { User } from '../../domain/entities/User';

// Importa el select tipado
import { userArgs, type UserRow } from './prisma-selects';

// Mapper de row -> entity
import { mapUserRowToEntity } from './mappers/UserMapper';

@Injectable() // Provider inyectable en Nest
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Buscar un usuario por email.
   * Devuelve la Entity de dominio o null si no existe.
   */
  async findByEmail(email: string): Promise<User | null> {
    // findUnique porque email está @unique en tu schema.prisma
    const row = await this.prisma.user.findUnique({
      where: { email },
      select: userArgs.select, // Trae SOLO lo necesario y queda tipado como UserRow
    });

    return row ? mapUserRowToEntity(row as UserRow) : null;
  }
}

