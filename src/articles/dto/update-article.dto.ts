import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  content?: string;
}
