//Adaptador NestJS para Prisma, forma estándar de conectar el cliente de Prisma en una app Nest, configuras cómo Prisma se comporta dentro de Nest

//interfaces de Nest para engancharse al ciclo de vida de los módulos (cuando se inicializan y destruyen).
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

//PrismaClient: es la clase que Prisma genera a partir de el schema.prisma. Es el cliente que sabe hablar con la DB.
import { PrismaClient, Prisma } from '@prisma/client';

//Extiende Prisma client por loq ue puede utilizar todos sus metodos como findMany, findUnique etc
//OnModuleInit y OnModuleDestroy para conectar/desconectar automáticamente cuando Nest arranca o se apaga.
@Injectable() //Decorador que marca la clase como un provider que puede ser inyectado en otros lugares
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  //Llama al constructor de PrismaClient
  constructor() {
    super({
      //Define qué tipo de logs va a sacar Prisma. Aquí solo errores y warnings, enviados a stdout (consola).
      log: [
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
      errorFormat: 'pretty', //errores se muestren “bonitos”
      datasources: {
        db: { url: process.env.DATABASE_URL }, //qué URL de base de datos usar
      },
    } satisfies Prisma.PrismaClientOptions);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
