import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ReplaceArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string | null = null;
}
