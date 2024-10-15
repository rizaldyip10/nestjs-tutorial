import { Category } from 'src/categories/entities/category.entity';
import { Product } from '../entities/product.entity';

export class ProductDTO {
  private id: number;
  private name: string;
  private price: number;
  private stock: number;
  private category: Category;
  private createdAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.stock = product.stock;
    this.category = product.category;
    this.createdAt = product.createdAt;
  }
}
