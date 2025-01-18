import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { ArePolygonCoordinates } from './ArePolygonCoordinates';

export class AreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Validate(ArePolygonCoordinates)
  polygon: [number, number][][];
}
