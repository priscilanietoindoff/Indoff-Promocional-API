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
    // findUnique porque email está @unique en schema.prisma
    const row = await this.prisma.user.findUnique({
      where: { email },
      select: userArgs.select, // Trae SOLO lo necesario y queda tipado como UserRow
    });

    return row ? mapUserRowToEntity(row as UserRow) : null;
  }

  async create(data: { 
    email: string; 
    passwordHash: string; 
    firstName?: string | null; 
    lastName?: string | null; 
    role?: 'USER' | 'ADMIN'; 
    isVerified?: boolean; 
}): Promise<User> {
    const row = await this.prisma.user.create({
        data: {
            email: data.email,
            passwordHash: data.passwordHash,
            firstName: data.firstName ?? null,
            lastName: data.lastName ?? null,
            role: data.role ?? 'USER',
            isVerified: data.isVerified ?? false,
        },
        select: userArgs.select, //Traer solo lo necesario y tipado
    });
    return mapUserRowToEntity(row as UserRow);
  }

  async markVerified(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }
}
