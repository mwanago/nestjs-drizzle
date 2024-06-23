import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
