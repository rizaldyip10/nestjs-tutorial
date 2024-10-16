import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { UpdateProductDto } from '../dto/request/update-product.dto';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/utils/response.util';
import { CategoriesService } from 'src/categories/service/categories.service';
import { PaginationDTO } from 'src/utils/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constant';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name, price, stock, categoryId } = createProductDto;

    if (name === '' || !price || !stock || !categoryId) {
      throw new BadRequestException(
        Response.failed(
          HttpStatus.BAD_REQUEST,
          'Please fill your fields correctly',
          null,
        ),
      );
    }

    const isProductExist = await this.productRepository.findOne({
      where: { name },
    });

    if (isProductExist) {
      throw new ConflictException(
        Response.failed(HttpStatus.CONFLICT, 'Product already exist', null),
      );
    }

    const category = await this.categoryService.findOne(categoryId);
    const newProduct = new Product();

    Object.assign(newProduct, { name, price, stock, category });

    return this.productRepository.save(newProduct);
  }

  async findAll(paginationDTO: PaginationDTO) {
    const page = Math.max(1, Number(paginationDTO.page) || 1);
    const limit = Math.max(1, Number(paginationDTO.limit) || DEFAULT_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      relations: ['category'],
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(
        Response.failed(HttpStatus.NOT_FOUND, 'Product not found', null),
      );
    }

    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, stock, price, categoryId } = updateProductDto;

    if (name === '') {
      throw new BadRequestException(
        Response.failed(
          HttpStatus.BAD_REQUEST,
          'Please fill your fields correctly',
          null,
        ),
      );
    }

    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        Response.failed(HttpStatus.NOT_FOUND, 'Product not found', null),
      );
    }

    if (categoryId) {
      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );
      product.category = category;
    }

    Object.assign(product, { name, price, stock });

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        Response.failed(HttpStatus.NOT_FOUND, 'Product not found', null),
      );
    }

    return this.productRepository.remove(product);
  }
}
