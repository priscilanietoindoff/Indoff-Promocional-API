"use strict";
//Adaptador NestJS para Prisma, forma estándar de conectar el cliente de Prisma en una app Nest, configuras cómo Prisma se comporta dentro de Nest
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
//interfaces de Nest para engancharse al ciclo de vida de los módulos (cuando se inicializan y destruyen).
const common_1 = require("@nestjs/common");
//PrismaClient: es la clase que Prisma genera a partir de el schema.prisma. Es el cliente que sabe hablar con la DB.
const client_1 = require("@prisma/client");
//Extiende Prisma client por loq ue puede utilizar todos sus metodos como findMany, findUnique etc
//OnModuleInit y OnModuleDestroy para conectar/desconectar automáticamente cuando Nest arranca o se apaga.
let PrismaService = class PrismaService extends client_1.PrismaClient {
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
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)() //Decorador que marca la clase como un provider que puede ser inyectado en otros lugares
    ,
    __metadata("design:paramtypes", [])
], PrismaService);
