import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
