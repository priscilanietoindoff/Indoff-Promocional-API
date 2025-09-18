//Nest es como un rompecabezas y los modulos son su corazon un modulo tiene providers, controllers etc.
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//Decorador Module para indicarle que es un conjunto se servicios y controladores que perteneccen juntos
@Module({
  providers: [PrismaService], //Le dice a Nest “cuando alguien necesite PrismaService, aquí está cómo proveerlo”
  exports: [PrismaService], //Hace que PrismaService esté disponible para otros módulos que importen PrismaModule.
  //Ejemplo: CatalogModule importa PrismaModule → ya puede inyectar PrismaService con los findmany, findunique y todo eso.
})
export class PrismaModule {}
