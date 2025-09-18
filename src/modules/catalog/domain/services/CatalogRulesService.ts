import type { Category } from '../entities/Category';
import type { Subcategory } from '../entities/Subcategory';
import type { Product } from '../entities/Product';

/**
 * Reglas de negocio puras sin interacciond e externos.
 * Aquí viven reglas que definen como funciona el negocio.
 * Siempre validas sin importat la tecnologia.
 * Aqui se muestran solo las reglas correpondientes. la funcionalidad de catalogo
 */
export class CatalogRulesService {
  /**
   * Un producto es visible cuando él, su subcategoría y su categoría están activos.
   * Devuelve true o false en caso de que se cumpla o no la regla de negocio
   */
  static isVisibleChain(
    category: Category,
    subcategory: Subcategory,
    product: Product,
  ): boolean {
    return !!(category?.isActive && subcategory?.isActive && product?.isActive);
  }

  /**
   * (TODO:Para admin)
   * Verifica que existan EXACTAMENTE 6 subcategorías visibles.
   * Devuelve true o False
   */
  static hasExactlySixVisibleSubcategories(
    subcategories: Subcategory[],
  ): boolean {
    return subcategories.filter((s) => s.isActive).length === 6;
  }

  /**
   * (TODO:Para admin)
   * Verifica que existan EXACTAMENTE 6 productos visibles en una subcategoría.
   * Devuelve true o False
   */
  static hasExactlySixVisibleProducts(products: Product[]): boolean {
    return products.filter((p) => p.isActive).length === 6;
  }
}
