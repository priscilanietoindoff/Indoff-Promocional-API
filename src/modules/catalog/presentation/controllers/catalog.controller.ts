import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

// Casos de uso
import { GetCategories } from '../../application/services/GetCategories';
import { GetSubcategoriesByCategory } from '../../application/services/GetSubcategories';
import { GetProductsBySubcategory } from '../../application/services/GetProductsBySubcategory';
import { GetProductDetail } from '../../application/services/GetProductDetail';

// DTOs de salida
import { CategoryDto } from '../../application/dtos/CategoryDto';
import { SubcategoryDto } from '../../application/dtos/SubcategoryDto';
import { ProductListItemDto } from '../../application/dtos/ProductListItemDto';
import { ProductDetailDto } from '../../application/dtos/ProductDetailDto';

@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly getCategories: GetCategories,
    private readonly getSubcategoriesByCategory: GetSubcategoriesByCategory,
    private readonly getProductsBySubcategory: GetProductsBySubcategory,
    private readonly getProductDetail: GetProductDetail,
  ) {}

  // GET /catalog/categories
  @Get('categories')
  async categories(): Promise<CategoryDto[]> {
    return this.getCategories.execute();
  }

  // GET /catalog/categories/:categorySlug/subcategories
  @Get('categories/:categorySlug/subcategories')
  async subcategories(
    @Param('categorySlug') categorySlug: string,
  ): Promise<SubcategoryDto[]> {
    return this.getSubcategoriesByCategory.execute(categorySlug);
  }

  // GET /catalog/categories/:categorySlug/subcategories/:subcategorySlug/products
  @Get('categories/:categorySlug/subcategories/:subcategorySlug/products')
  async productsBySubcategory(
    @Param('categorySlug') categorySlug: string,
    @Param('subcategorySlug') subcategorySlug: string,
  ): Promise<ProductListItemDto[]> {
    return this.getProductsBySubcategory.execute(categorySlug, subcategorySlug);
  }

  // GET /catalog/products/:productSlug
  @Get('products/:productSlug')
  async productDetail(
    @Param('productSlug') productSlug: string,
  ): Promise<ProductDetailDto> {
    const dto = await this.getProductDetail.execute(productSlug);
    if (!dto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return dto;
  }
}
