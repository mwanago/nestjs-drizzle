import { serial, text, pgTable, geometry } from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core';
import { Geometry } from 'wkx';

type Coordinate = [number, number];

interface GeoJson {
  type: string;
  coordinates: Coordinate[][];
}

const polygon = customType<{ data: Coordinate[][]; driverData: string }>({
  dataType() {
    return 'geometry(Polygon, 4326)';
  },
  toDriver(coordinates: Coordinate[][]): string {
    return JSON.stringify({
      type: 'Polygon',
      coordinates,
    });
  },
  fromDriver(data: string) {
    const geoJson = Geometry.parse(
      Buffer.from(data, 'hex'),
    ).toGeoJSON() as GeoJson;

    return geoJson.coordinates;
  },
});

export const locations = pgTable('locations', {
  id: serial().primaryKey(),
  name: text().notNull(),
  coordinates: geometry('coordinates', {
    type: 'point',
    mode: 'xy',
    srid: 4326,
  }).notNull(),
});

export const areas = pgTable('areas', {
  id: serial().primaryKey(),
  name: text().notNull(),
  polygon: polygon('polygon').notNull(),
});

export const databaseSchema = {
  locations,
  areas,
};
