//dto para las categorias
export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
}
