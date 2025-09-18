import type { Category } from '../entities/Category';
import type { Subcategory } from '../entities/Subcategory';
import type { Product } from '../entities/Product';

/**
 * Contrato que la capa de aplicación usará y que se conectara con la capa de infraestructura mediante este contrato.
 * basicmaente este contrato dice "necesito que me traigas esto"
 */
export interface ProductContext {
  product: Product;
  subcategory: Subcategory;
  category: Category;
}

/**
 * Token de inyección del repositorio de catálogo.
 * Permite que Application dependa del contrato (interfaz) sin acoplarse a la implementación concreta.
 * En el módulo se hace: { provide: CATALOG_REPOSITORY, useClass: CatalogPrismaRepository }
 * Y en los services: constructor(@Inject(CATALOG_REPOSITORY) private readonly repo: CatalogRepository) {}
 */
export const CATALOG_REPOSITORY = Symbol('CATALOG_REPOSITORY');

export interface CatalogRepository {
  /**
   * Devuelve las 3 categorías activas (orden estable: sortOrder o name).
   */
  findActiveCategories(): Promise<Category[]>;

  /**
   * Devuelve las 6 subcategorías activas de una categoría por slug (orden estable).
   */
  findActiveSubcategoriesByCategorySlug(
    categorySlug: string,
  ): Promise<Subcategory[]>;

  /**
   * Devuelve los 6 productos activos de una subcategoría (orden estable).
   * No importa que product no tenga categorySlug ni subcategorySlug porque existe una relacion entre ambos y con un joins e realiza
   */
  findActiveProductsBySubcategory(
    categorySlug: string,
    subcategorySlug: string,
  ): Promise<Product[]>;

  //trae el contexto completo por slug (sin imponer la regla)
  findProductContextBySlug(productSlug: string): Promise<ProductContext | null>;
}
