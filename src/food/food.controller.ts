import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  getAll() {
    return this.foodService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.foodService.getById(id);
  }

  @Post()
  create(@Body() food: CreateFoodDto) {
    return this.foodService.create(food);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() food: UpdateFoodDto) {
    return this.foodService.update(id, food);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.foodService.delete(id);
  }
}
