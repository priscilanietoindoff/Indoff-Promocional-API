"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
//Nest es como un rompecabezas y los modulos son su corazon un modulo tiene providers, controllers etc.
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
//Decorador Module para indicarle que es un conjunto se servicios y controladores que perteneccen juntos
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService], //Le dice a Nest “cuando alguien necesite PrismaService, aquí está cómo proveerlo”
        exports: [prisma_service_1.PrismaService], //Hace que PrismaService esté disponible para otros módulos que importen PrismaModule.
        //Ejemplo: CatalogModule importa PrismaModule → ya puede inyectar PrismaService con los findmany, findunique y todo eso.
    })
], PrismaModule);
