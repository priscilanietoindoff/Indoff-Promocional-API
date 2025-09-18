//Archivo para la Conexion entre prisma y el dominio, entrega Entities (Dominio). Los DTOs se crean en Application.
import { Injectable } from '@nestjs/common';
//cliente Prisma envuelto para Nes
import { PrismaService } from '../../../prisma/prisma.service';

//contratos del Domain
import type {
  CatalogRepository,
  ProductContext,
} from '../../domain/repositories/CatalogRepository';

//Entities
import type { Category } from '../../domain/entities/Category';
import type { Subcategory } from '../../domain/entities/Subcategory';
import type { Product } from '../../domain/entities/Product';

//Importa los select/include tipados
import {
  categoryArgs,
  subcategoryArgs,
  productArgs,
  productContextArgs,
} from './prisma-selects';

//los mappers de row->entity
import { mapCategoryRowToEntity } from './mappers/category.mapper';
import { mapSubcategoryRowToEntity } from './mappers/subcategory.mapper';
import { mapProductRowToEntity } from './mappers/product.mapper';

@Injectable() //Decorador que marca la clase como un provider que puede ser inyectado en otros lugares (ej. un servicio de Application).
export class CatalogPrismaRepository implements CatalogRepository {
  //implements obliga a que esta clase tenga todos los métodos que prometimos en el contrato de dominio (findActiveCategories, findActiveProductsBySubcategory, etc.

  //Contructor pide una insatncia de PrismaService
  //Private readonly: declara la propiedad primsa en la clase, la inicializa, Así, en el cuerpo de la clase puedes usar this.prisma para hacer queries
  constructor(private readonly prisma: PrismaService) {}

  // ================== CATEGORIES ==================
  //Devuelve todas las categorías activas ordenadas por name
  //devuelve una promesa de un array de Entities
  //findmany dame muchos registros de un modelo que cumpla con el where. ejecuta query
  async findActiveCategories(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }, // cuando agregues sortOrder, cámbialo aquí
      //Selecciona los categoryArgs que ya definimos previamente y no los metemos directamente aqui
      select: categoryArgs.select,
    });
    return rows.map((r) => mapCategoryRowToEntity(r)); //Mapea cada fila tipada (CategoryRow) con mapCategoryRowToEntity
  }

  // ================= SUBCATEGORIES ================
  //Devuelve las subcategorias por categoryslug
  async findActiveSubcategoriesByCategorySlug(
    categorySlug: string, //Recibe como aprametro el categorySlug
  ): Promise<Subcategory[]> {
    //Busca una categoria con ese slug solo una
    //Usa findUnique porque slug está marcado como @unique
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true }, //Solo selecciona el campo id (no necesita nada más).
    });
    if (!category) return [];

    //Filtra subcategorías que pertenezcan a esa categoría con findmany por que son muchas (categoryId: category.id) y que estén activas (isActive: true).
    const rows = await this.prisma.subcategory.findMany({
      where: { categoryId: category.id, isActive: true },
      orderBy: { name: 'asc' }, // luego sortOrder
      select: subcategoryArgs.select, // traer solo los campos necesarios y tipar el resultado como SubcategoryRow
    });

    return rows.map((r) => mapSubcategoryRowToEntity(r));
  }

  // =================== PRODUCTS ===================
  //Devuelve los productos por subcategoria utilizando los slug de categoria y subcategoria
  /*
    SELECT * 
    FROM Subcategory s
    JOIN Category c ON c.id = s.categoryId
    WHERE s.slug = 'plumas' 
    AND c.slug = 'retention';
  */
  async findActiveProductsBySubcategory(
    categorySlug: string,
    subcategorySlug: string,
  ): Promise<Product[]> {
    //Busca la subcategoría por su slug y que su categoría asociada tenga ese slug.
    //Asegura que no pidas productos de una subcategoría que no pertenece a esa categoría
    //no usamos findunique por que el slug de subcategoria noe s Unique una subcategoria puede existir en dos categorias dame la primera subcategoría que cumpla estas condiciones
    const sub = await this.prisma.subcategory.findFirst({
      where: { slug: subcategorySlug, category: { slug: categorySlug } },
      select: { id: true },
    });
    if (!sub) return [];

    //Todos los productos que pertenecen a esa subcategoría a ese id que seleccionamos.
    const rows = await this.prisma.product.findMany({
      where: { subcategoryId: sub.id, isActive: true },
      orderBy: { name: 'asc' }, // luego sortOrder
      select: productArgs.select, //La seleccion que definimos en los prisma-selects
    });

    return rows.map((r) => mapProductRowToEntity(r)); //mapear a la entidad
  }

  // =================== PRODUCT DETAIL ===================
  //Product context ya trae product, category subproduct ideal apara eld etalle del producto y la regla de negocio isVisibleChain
  //Se busca por productSlug y se devuelve el productContext que trae todo category, subcategory y product
  async findProductContextBySlug(
    productSlug: string,
  ): Promise<ProductContext | null> {
    const row = await this.prisma.product.findFirst({
      where: { slug: productSlug }, // sin filtro de isActive aquí
      include: productContextArgs.include, //Select previamente armado y tipado
    });
    if (!row) return null;

    //Como el ProductCOntext tiene todas las relaciones las mappeamos a entidades que todas las contiene row
    const product = mapProductRowToEntity(row); // row incluye productImages
    const subcategory = mapSubcategoryRowToEntity(row.subcategory);
    const category = mapCategoryRowToEntity(row.subcategory.category);

    //Y se retornan
    return { product, subcategory, category };
  }
}
