import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { UpdateProductDto } from '../dto/request/update-product.dto';
import { Response } from 'src/utils/response.util';
import { ProductDTO } from '../dto/product.dto';
import { PaginationDTO } from 'src/utils/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const response = await this.productsService.create(createProductDto);
    return Response.successful(
      HttpStatus.CREATED,
      'Product created',
      new ProductDTO(response),
    );
  }

  @Get()
  async findAll(@Query() paginationDTO: PaginationDTO) {
    const { data, total, page, limit } =
      await this.productsService.findAll(paginationDTO);
    const response = data.map((item) => new ProductDTO(item));
    return Response.pagination(
      HttpStatus.OK,
      'Product list fetched',
      response,
      total,
      page,
      limit,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.productsService.findOne(+id);
    return Response.successful(
      HttpStatus.OK,
      'Product fetched',
      new ProductDTO(response),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const response = await this.productsService.update(+id, updateProductDto);
    return Response.successful(
      HttpStatus.OK,
      'Product updated',
      new ProductDTO(response),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.productsService.remove(+id);
    return Response.successful(
      HttpStatus.OK,
      'Product deleted',
      new ProductDTO(response),
    );
  }
}
