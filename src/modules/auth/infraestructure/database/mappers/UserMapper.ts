import type { User } from '../../../domain/entities/User';
import type { UserRow } from '../prisma-selects';
import { Role } from '../../../domain/entities/User';

export const mapUserRowToEntity = (r: UserRow): User => ({
  id: r.id,
  email: r.email,
  passwordHash: r.passwordHash,
  role: r.role === 'ADMIN' ? Role.ADMIN : Role.USER,
  isVerified: r.isVerified,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});
