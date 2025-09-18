import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Importa tu módulo de catálogo en Presentation
import { CatalogModule } from './modules/catalog/presentation/catalog.module';
import { HealthController } from './modules/health/health.controller';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // variables de entorno accesibles en toda la app
    PrismaModule, // acceso a PrismaService
    CatalogModule // catálogo con Clean Architecture
  ],
  controllers: [HealthController],
})
export class AppModule {}
