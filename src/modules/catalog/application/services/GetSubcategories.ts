import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/CatalogRepository';
import { CatalogMappers } from '../mappers/CatalogMappers';
import type { SubcategoryDto } from '../dtos/SubcategoryDto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetSubcategoriesByCategory {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly repo: CatalogRepository,
  ) {}

  async execute(categorySlug: string): Promise<SubcategoryDto[]> {
    const subs =
      await this.repo.findActiveSubcategoriesByCategorySlug(categorySlug);
    return subs.map((s) => CatalogMappers.toSubcategoryDto(s));
  }
}
