import type { Token } from '../../../domain/entities/Token';
import type { TokenRow } from '../prisma-selects';

export const mapTokenRowToEntity = (r: TokenRow): Token => ({
    id: r.id,
    userId: r.userId,
    type: r.type as Token['type'],
    token: r.token,
    consumed: r.consumed,
    expiresAt: r.expiresAt,
    createdAt: r.createdAt,
})