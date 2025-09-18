import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';

import { CatalogController } from './controllers/catalog.controller';

// Repo (Infra)
import { CatalogPrismaRepository } from '../infraestructure/database/catalog.prisma.repository';

// Dominio (contrato del repo)
import { CATALOG_REPOSITORY } from '../domain/repositories/CatalogRepository';

// Application Services (casos de uso)
import { GetCategories } from '../application/services/GetCategories';
import { GetSubcategoriesByCategory } from '../application/services/GetSubcategories';
import { GetProductsBySubcategory } from '../application/services/GetProductsBySubcategory';
import { GetProductDetail } from '../application/services/GetProductDetail';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogController],
  providers: [
    // Vincula el contrato con la implementación de Infra
    { provide: CATALOG_REPOSITORY, useClass: CatalogPrismaRepository },

    // Casos de uso
    GetCategories,
    GetSubcategoriesByCategory,
    GetProductsBySubcategory,
    GetProductDetail,
  ],
})
export class CatalogModule {}
