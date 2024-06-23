import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoriesService } from './categories.service';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll() {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() data: CategoryDto) {
    return this.categoriesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: CategoryDto) {
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.delete(id);
  }
}
