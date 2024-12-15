import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchArticlesQuery {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search?: string;
}
