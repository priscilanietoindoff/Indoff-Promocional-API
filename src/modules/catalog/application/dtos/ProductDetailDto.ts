//dto para el producto pero cuando aparece a detalle una vez que le haces click
import type { ProductAttributes } from '../../domain/entities/Product';

export interface ProductDetailDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  attributes?: ProductAttributes | null;
  images: Array<{ url: string; alt?: string | null; sortOrder: number }>;
  subcategory: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
}
