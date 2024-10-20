import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  parentCategoryId?: number;
}
