//Igual traducir productorow a su entidad
import type { Product, ProductImage } from '../../../domain/entities/Product';
import type { ProductRow, ProductContextRow } from '../prisma-selects';

export const mapProductRowToEntity = (
  r: ProductRow | ProductContextRow, //Permite recibir tanto un producto "suelto" (ProductRow) como un producto con contexto (ProductContextRow que incluye subcategoría y categoría).
): Product => ({
  id: r.id,
  subcategoryId: r.subcategoryId,
  name: r.name,
  slug: r.slug,
  nameEn: r.nameEn ?? null,
  slugEn: r.slugEn ?? null,
  description: r.description ?? null,
  descriptionEn: r.descriptionEn ?? null,
  attributes: (r.attributes as Product['attributes']) ?? null,
  images: (r.productImages as ProductImage[]) ?? [], //Prisma devuelve las imágenes según el select
  isActive: !!r.isActive,
  sortOrder: null, // cuando exista en el schema
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});
