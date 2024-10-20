import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds: number[] = [];

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledDate?: Date;
}
