//Mapper que mapea las entidades de dominio a dtos pero solo lo necesario para no filtrar toda la entidad de dominio
//Basicmaente pasamos de dominio -> application solo con lo necesario
import type { Category } from '../../domain/entities/Category';
import type { Subcategory } from '../../domain/entities/Subcategory';
import type { Product } from '../../domain/entities/Product';
import type { CategoryDto } from '../dtos/CategoryDto';
import type { SubcategoryDto } from '../dtos/SubcategoryDto';
import type { ProductListItemDto } from '../dtos/ProductListItemDto';
import type { ProductDetailDto } from '../dtos/ProductDetailDto';

//mapeo de category entity a categoryDto
export const CatalogMappers = {
  toCategoryDto(c: Category): CategoryDto {
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      imageUrl: c.imageUrl ?? null,
      imageAlt: c.imageAlt ?? null,
    };
  },

  //mapeo de Subcategory entity a SubcategoryDto
  toSubcategoryDto(s: Subcategory): SubcategoryDto {
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      imageUrl: s.imageUrl ?? null,
      imageAlt: s.imageAlt ?? null,
    };
  },

  //mapeo de Product entity a ProductListItemDto
  toProductListItemDto(pL: Product): ProductListItemDto {
    // Tomamos la primera imagen (si existe) para el grid
    const first = pL.images?.[0];
    return {
      id: pL.id,
      name: pL.name,
      slug: pL.slug,
      imageUrl: first?.url ?? null,
      imageAlt: first?.alt ?? null,
    };
  },

  //mapeo de Product entity a ProductDetailDto
  toProductDetailDto(
    pD: Product,
    subcategory: { id: string; name: string; slug: string },
    category: { id: string; name: string; slug: string },
  ): ProductDetailDto {
    return {
      id: pD.id,
      name: pD.name,
      slug: pD.slug,
      description: pD.description ?? null,
      attributes: pD.attributes ?? null,
      images: pD.images ?? [],
      subcategory,
      category,
    };
  },
};
