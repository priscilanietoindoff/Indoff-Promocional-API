// Tipado de los atributos en JSON
export interface ProductAttributes {
  colors?: string[];
  sizes?: string[]; // ('XS'|'S'|'M'|'L'|'XL')
  dimensions?: { widthMm?: number; heightMm?: number; depthMm?: number };
  material?: string;
  // Permite añadir mas atributos sinque se rompa la interfaz actual
  [key: string]: unknown;
}

//Entidad de dominio de productImage el de arriba es el json de atributos
export interface ProductImage {
  url: string;
  alt?: string | null;
  sortOrder: number; // 0..n
}

// Entidad de dominio de Product que lo compone product attributtes y productImage
export interface Product {
  id: string; // uuid generado
  subcategoryId: string; // uuid referencia a su subcategoria

  name: string;
  slug: string;
  nameEn?: string | null;
  slugEn?: string | null;

  description?: string | null;
  descriptionEn?: string | null;

  attributes?: ProductAttributes | null;
  images: ProductImage[];

  isActive: boolean;
  sortOrder?: number | null; // opcional (si luego lo agregas al schema)

  createdAt?: Date;
  updatedAt?: Date;
}
