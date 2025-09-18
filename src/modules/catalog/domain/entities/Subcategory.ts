// Entidad de dominio: Subcategory sin involucramiento externo
export interface Subcategory {
  id: string; // uuid generado
  categoryId: string; // uuid (referencia interna a la categoria que pertenece)

  name: string;
  slug: string;
  nameEn?: string | null;
  slugEn?: string | null;

  imageUrl?: string | null;
  imageAlt?: string | null;
  imageUrlEn?: string | null;
  imageAltEn?: string | null;

  isActive: boolean;
  sortOrder?: number | null; // TODO: recomendado para orden estable (0..5)

  createdAt?: Date;
  updatedAt?: Date;
}
