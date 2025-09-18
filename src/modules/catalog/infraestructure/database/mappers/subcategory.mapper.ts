import type { Subcategory } from '../../../domain/entities/Subcategory';
import type { SubcategoryRow } from '../prisma-selects';

export const mapSubcategoryRowToEntity = (r: SubcategoryRow): Subcategory => ({
  id: r.id,
  categoryId: r.categoryId,
  name: r.name,
  slug: r.slug,
  nameEn: r.nameEn ?? null,
  slugEn: r.slugEn ?? null,
  imageUrl: r.imageUrl ?? null,
  imageAlt: r.imageAlt ?? null,
  imageUrlEn: r.imageUrlEn ?? null,
  imageAltEn: r.imageAltEn ?? null,
  isActive: !!r.isActive,
  sortOrder: null,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});
