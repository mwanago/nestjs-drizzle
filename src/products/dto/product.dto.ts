import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  properties: Record<string, unknown>;
}
