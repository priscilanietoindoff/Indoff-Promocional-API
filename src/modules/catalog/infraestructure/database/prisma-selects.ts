//Para indicarle a Prisma que es loq ue queremos que nos traiga para cada tabla SOLO INDICARLE No hay lógica, no hay queries aquí. Solo defines qué campos exactos se van a devolver y tipas el resultado con CategoryRow, SubcategoryRow
import { Prisma } from '@prisma/client';

/**
 * Category (select)
 * Prisma.validator funcion que prisma expone para typescript quiero construir un objeto select/include y que este validado si se escribe mal el campo el error se arroja aqui
 * Prisma.CategoryDefaultArgs prisma genera uno para cada modelo, tiene las opciones oposibles de select e include para ese modelo especifico DEFINE QUE CAMPOS DE CATEGORY PUEDES SLECCIONAR/INCLUIR
 * Prisma.validator<Prisma.CategoryDefaultArgs>() Voy a construir un objeto con select/include valido apra category sin validator el objeto sería un simple literal y no tendrías tipado fuerte lo cuale s el fuerte de typescript
 */
export const categoryArgs = Prisma.validator<Prisma.CategoryDefaultArgs>()({
  //Que columnas exactas queremos seleccioanr de la tabla Category (Solo Columnas)
  //Este objeto se guarda en la constante categoryArgs
  //gracias a validator, TypeScript sabe que ese select es válido para el modelo Category.
  select: {
    id: true,
    name: true,
    slug: true,
    nameEn: true,
    slugEn: true,
    imageUrl: true,
    imageAlt: true,
    imageUrlEn: true,
    imageAltEn: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  },
});
//construye el tipo exacto de las filas que Prisma devolverá con ese select.
//p.e: si en el select quitas imageAlt, entonces CategoryRow ya no tendrá imageAlt.
export type CategoryRow = Prisma.CategoryGetPayload<typeof categoryArgs>;

// Subcategory (select)
export const subcategoryArgs =
  Prisma.validator<Prisma.SubcategoryDefaultArgs>()({
    select: {
      id: true,
      categoryId: true,
      name: true,
      slug: true,
      nameEn: true,
      slugEn: true,
      imageUrl: true,
      imageAlt: true,
      imageUrlEn: true,
      imageAltEn: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
export type SubcategoryRow = Prisma.SubcategoryGetPayload<
  typeof subcategoryArgs
>;

// Product utilizando el select del ProductDefaultArgs
export const productArgs = Prisma.validator<Prisma.ProductDefaultArgs>()({
  select: {
    id: true,
    subcategoryId: true,
    name: true,
    slug: true,
    nameEn: true,
    slugEn: true,
    description: true,
    descriptionEn: true,
    attributes: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    productImages: {
      orderBy: { sortOrder: 'asc' },
      select: { url: true, alt: true, sortOrder: true },
    },
  },
});
export type ProductRow = Prisma.ProductGetPayload<typeof productArgs>;

/**
 * include trae toda la relacion en la misma consulta select solo columnas Product + Subcategory + Category + Images de un solo golpe
 * Ya dentro del include en cada tabla puedes hacer un select apra atarer columans de esa tabla especifica
 */
// Product utilizando el include del ProductDefaultArgs
export const productContextArgs = Prisma.validator<Prisma.ProductDefaultArgs>()(
  {
    include: {
      productImages: {
        orderBy: { sortOrder: 'asc' },
        select: { url: true, alt: true, sortOrder: true },
      },
      subcategory: {
        select: {
          ...subcategoryArgs.select, //Incluye la subcategoría del producto usando el mismo select tipado que definimos para subcategorías.
          category: { select: categoryArgs.select }, // Y dentro de la subcategoría, incluye su categoría usando el select tipado de categorías.
        },
      },
    },
  },
);
export type ProductContextRow = Prisma.ProductGetPayload<
  typeof productContextArgs
>;
