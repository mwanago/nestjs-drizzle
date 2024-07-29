import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';
import { Type } from 'class-transformer';

export class UpdateArticleDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @CanBeUndefined()
  paragraphs?: string[];

  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledDate?: Date;
}
