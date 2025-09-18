//traducir una fila de Prisma (CategoryRow) a una Entity de dominio (Category) aun no hay dtos eso lo ahremos en application y solo loq ue necesitemos
import type { Category } from '../../../domain/entities/Category';
import type { CategoryRow } from '../prisma-selects';

//Se mapea el CategoryRow "r" a la entidad Category
export const mapCategoryRowToEntity = (r: CategoryRow): Category => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  nameEn: r.nameEn ?? null,
  slugEn: r.slugEn ?? null,
  imageUrl: r.imageUrl ?? null,
  imageAlt: r.imageAlt ?? null,
  imageUrlEn: r.imageUrlEn ?? null,
  imageAltEn: r.imageAltEn ?? null,
  isActive: !!r.isActive,
  // Cuando agregues sortOrder al schema, mapéalo aquí
  sortOrder: null,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});
