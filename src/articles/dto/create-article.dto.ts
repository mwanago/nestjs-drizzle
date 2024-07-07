import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateArticleDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  paragraphs: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds: number[] = [];
}
