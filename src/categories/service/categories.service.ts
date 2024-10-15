import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Response } from 'src/utils/response.util';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    if (createCategoryDto.name === '') {
      throw new BadRequestException(
        Response.failed(
          HttpStatus.BAD_REQUEST,
          'Please fill your fields correctly',
          null,
        ),
      );
    }

    const alreadyExistCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (alreadyExistCategory) {
      throw new ConflictException(
        Response.failed(
          HttpStatus.CONFLICT,
          'Category already in database',
          null,
        ),
      );
    }

    const category = new Category();

    Object.assign(category, createCategoryDto);

    return this.categoriesRepository.save(category);
  }

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: number) {
    const result = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(
        Response.failed(HttpStatus.NOT_FOUND, 'Data not found!', null),
      );
    }

    return result;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name === '') {
      throw new BadRequestException(
        Response.failed(
          HttpStatus.BAD_REQUEST,
          'Please fill your fields correctly',
          null,
        ),
      );
    }

    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        Response.failed(HttpStatus.NOT_FOUND, 'Category is not found!', null),
      );
    }

    category.name = updateCategoryDto.name;

    return this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        Response.failed(HttpStatus.NOT_FOUND, 'Category is not found!', null),
      );
    }

    return this.categoriesRepository.remove(category);
  }
}
