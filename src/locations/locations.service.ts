import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAll() {
    return this.drizzleService.db.select().from(databaseSchema.locations);
  }

  async getById(locationId: number) {
    const locations = await this.drizzleService.db
      .select()
      .from(databaseSchema.locations)
      .where(eq(databaseSchema.locations.id, locationId));
    const location = locations.pop();
    if (!location) {
      throw new NotFoundException();
    }
    return location;
  }

  async create(location: LocationDto) {
    const createdLocations = await this.drizzleService.db
      .insert(databaseSchema.locations)
      .values({
        name: location.name,
        coordinates: location.coordinates,
      })
      .returning();

    return createdLocations.pop();
  }
}
