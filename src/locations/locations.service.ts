import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { ne, eq, sql, and } from 'drizzle-orm';
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

  async getDistanceBetweenLocations(
    firstLocationId: number,
    secondLocationId: number,
  ) {
    const queryResult = await this.drizzleService.db.execute(
      sql`
        SELECT ST_DistanceSphere(
          (SELECT coordinates FROM ${databaseSchema.locations} WHERE id = ${firstLocationId}),
          (SELECT coordinates FROM ${databaseSchema.locations} WHERE id = ${secondLocationId})
        ) AS distance;
      `,
    );

    const distance = queryResult.rows.pop()?.distance;

    if (distance === null) {
      throw new NotFoundException();
    }

    return distance;
  }

  getLocationsInRadius(locationId: number, radiusInMeters: number) {
    return this.drizzleService.db
      .select()
      .from(databaseSchema.locations)
      .where(
        and(
          ne(databaseSchema.locations.id, locationId),
          sql`ST_DWithin(
            ${databaseSchema.locations.coordinates}::geography,
            (SELECT ${databaseSchema.locations.coordinates}::geography FROM ${databaseSchema.locations} WHERE id = ${locationId}),
            ${radiusInMeters}
          )`,
        ),
      );
  }
}
