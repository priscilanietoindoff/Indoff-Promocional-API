import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

import type { TokenRepository } from '../../domain/repositories/TokenRepository';
import type { Token, TokenType } from '../../domain/entities/Token';

import { tokenArgs, type TokenRow } from './prisma-selects';
import { mapTokenRowToEntity } from './mappers/TokenMapper';

@Injectable()
export class TokenPrismaRepository implements TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    userId: string;
    type: TokenType;
    token: string;
    expiresAt: Date;
  }): Promise<Token> {
    const row = await this.prisma.token.create({
      data: {
        userId: params.userId,
        type: params.type,
        token: params.token,
        expiresAt: params.expiresAt,
        consumed: false,
      },
      select: tokenArgs.select,
    });
    return mapTokenRowToEntity(row as TokenRow);
  }

  async findByTokenAndType(token: string, type: TokenType): Promise<Token | null> {
    const row = await this.prisma.token.findFirst({
      where: { token, type, consumed: false, expiresAt: { gt: new Date() } },
      select: tokenArgs.select,
    });
    return row ? mapTokenRowToEntity(row as TokenRow) : null;
  }

  async markAsConsumed(id: string): Promise<void> {
    await this.prisma.token.update({
      where: { id },
      data: { consumed: true },
    });
  }

  async invalidateByUserAndType(userId: string, type: TokenType): Promise<number> {
    const res = await this.prisma.token.updateMany({
      where: {
        userId,
        type,
        consumed: false,
        expiresAt: { gt: new Date() },
      },
      data: { consumed: true },
    });
    return res.count; // cuántos tokens invalidaste
  }
}
