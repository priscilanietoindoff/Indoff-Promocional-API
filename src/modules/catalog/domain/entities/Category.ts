// Entidad de dominio para Categoria que no depende de externo ni se involucra otro elemento como base de datos, prisma etc.
// NOTA: lo que termina con En Es para cuando se implemente la apgina en ingles y no afecte al SEO
export interface Category {
  id: string; // uuid (id generado)
  name: string;
  slug: string; //Para no usar el id comoparte de al ruta en web
  nameEn?: string | null;
  slugEn?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  imageUrlEn?: string | null;
  imageAltEn?: string | null;
  isActive: boolean; //Si la categoria esta activa o no
  // TODO: Orden estable recomendado (cuando lo agregues al schema)
  sortOrder?: number | null;

  // Opcional si te sirven en dominio (no obligatorio)
  createdAt?: Date;
  updatedAt?: Date;
}
