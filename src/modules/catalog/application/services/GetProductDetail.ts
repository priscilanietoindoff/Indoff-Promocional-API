import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/CatalogRepository';
import { CatalogRulesService } from '../../domain/services/CatalogRulesService';
import { CatalogMappers } from '../mappers/CatalogMappers';
import type { ProductDetailDto } from '../dtos/ProductDetailDto';
import { Inject, Injectable } from '@nestjs/common';
//Asi se deberia ver un Service con su regla de negocio
@Injectable()
export class GetProductDetail {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly repo: CatalogRepository,
  ) {}

  async execute(productSlug: string): Promise<ProductDetailDto | null> {
    // Usamos el método de dominio que nos da el CONTEXTO completo
    const ctx = await this.repo.findProductContextBySlug(productSlug);
    if (!ctx) return null;

    const { product, subcategory, category } = ctx;

    // AQUI aplicamos la REGLA de negocio (en Application usando Domain) lo trae solo si es=las dos catgorias detars son vivibles
    const visible = CatalogRulesService.isVisibleChain(
      category,
      subcategory,
      product,
    );
    if (!visible) return null; // El controller decidirá si devuelve 404

    //Mappea la entidad del producto al dto de detail product
    return CatalogMappers.toProductDetailDto(
      product,
      { id: subcategory.id, name: subcategory.name, slug: subcategory.slug },
      { id: category.id, name: category.name, slug: category.slug },
    );
  }
}
