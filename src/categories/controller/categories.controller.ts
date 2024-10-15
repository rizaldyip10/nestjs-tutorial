import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Response } from 'src/utils/response.util';

// /categories
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // /categories
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const response = await this.categoriesService.create(createCategoryDto);
    return Response.successful(
      HttpStatus.CREATED,
      'Category created',
      response,
    );
  }

  @Get()
  async findAll() {
    const response = await this.categoriesService.findAll();
    return Response.successful(
      HttpStatus.OK,
      'Category list fetched',
      response,
    );
  }
  // /categories/id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.categoriesService.findOne(+id);
    return Response.successful(HttpStatus.OK, 'Category fetched', response);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const response = await this.categoriesService.update(
      +id,
      updateCategoryDto,
    );
    return Response.successful(HttpStatus.OK, 'Category updated', response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.categoriesService.remove(+id);
    return Response.successful(HttpStatus.OK, 'Category deleted', response);
  }
}
