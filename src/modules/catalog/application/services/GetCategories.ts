import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/CatalogRepository';
import { CatalogMappers } from '../mappers/CatalogMappers';
import type { CategoryDto } from '../dtos/CategoryDto';
import { Inject, Injectable } from '@nestjs/common';
//Basicamente son casos de uso uno por archivo
//la rgela de negocios e aplciaria aqui tambien si le correspondiera una
//Interactua con el repositorio (el contrato de domain) apra generar peticiones para traer los datos
//Solo sabe que: “Alguien me pidió esto, yo voy al repositorio, aplico reglas, y devuelvo esto otro”.
@Injectable()
export class GetCategories {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly repo: CatalogRepository,
  ) {}

  async execute(): Promise<CategoryDto[]> {
    const categories = await this.repo.findActiveCategories(); //Se ejecuta lo de devolver las 3 categorias del repo de domain
    // Orden estable: si aún no tienes sortOrder, el repo puede ordenarlas por name
    return categories.map((c) => CatalogMappers.toCategoryDto(c)); //Devuelve el dto listo apra que el cliente lo use mapeando el domain al dto con el mapper
  }
}
