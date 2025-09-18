import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/CatalogRepository';
import { CatalogMappers } from '../mappers/CatalogMappers';
import type { ProductListItemDto } from '../dtos/ProductListItemDto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetProductsBySubcategory {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly repo: CatalogRepository,
  ) {}

  async execute(
    categorySlug: string,
    subcategorySlug: string,
  ): Promise<ProductListItemDto[]> {
    // Regla de negocio: 6 productos visibles ordenados
    const products = await this.repo.findActiveProductsBySubcategory(
      categorySlug,
      subcategorySlug,
    );
    return products.map((p) => CatalogMappers.toProductListItemDto(p));
  }
}
