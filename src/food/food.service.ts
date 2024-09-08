import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(private readonly drizzleService: DrizzleService) {}

  getAll() {
    return this.drizzleService.db.select().from(databaseSchema.food);
  }

  async getById(id: number) {
    const foodResults = await this.drizzleService.db
      .select()
      .from(databaseSchema.food)
      .where(eq(databaseSchema.food.id, id));
    const food = foodResults.pop();
    if (!food) {
      throw new NotFoundException();
    }
    return food;
  }

  async create(food: CreateFoodDto) {
    const createdFoods = await this.drizzleService.db
      .insert(databaseSchema.food)
      .values({
        name: food.name,
        expiryAfterOpening: food.expiryAfterOpening,
      })
      .returning();

    return createdFoods.pop();
  }

  async update(id: number, food: UpdateFoodDto) {
    const updatedFoods = await this.drizzleService.db
      .update(databaseSchema.food)
      .set({
        name: food.name,
        expiryAfterOpening: food.expiryAfterOpening,
      })
      .where(eq(databaseSchema.food.id, id))
      .returning();

    if (updatedFoods.length === 0) {
      throw new NotFoundException();
    }

    return updatedFoods.pop();
  }

  async delete(id: number) {
    const deletedFoods = await this.drizzleService.db
      .delete(databaseSchema.food)
      .where(eq(databaseSchema.food.id, id))
      .returning();

    if (deletedFoods.length === 0) {
      throw new NotFoundException();
    }
  }
}
