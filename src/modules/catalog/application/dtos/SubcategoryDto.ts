//dto para las Subcategorias
export interface SubcategoryDto {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
}
