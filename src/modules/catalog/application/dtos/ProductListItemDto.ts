//dto para el producto pero cuando aparece listado en home
export interface ProductListItemDto {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null; // primera imagen si existe
  imageAlt?: string | null;
}
