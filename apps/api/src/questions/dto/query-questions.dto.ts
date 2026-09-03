import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class QueryQuestionsDto {
  @ApiPropertyOptional({ description: 'Page number for offset pagination', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Case-insensitive search across question title, content, slug, category, technology, and answer', example: 'event loop' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by Category ID (UUID) or Category Slug', example: 'frontend-development' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by Technology ID (UUID) or Technology Slug', example: 'nodejs' })
  @IsOptional()
  @IsString()
  technology?: string;

  @ApiPropertyOptional({ description: 'Filter by difficulty level', enum: Difficulty, example: Difficulty.MEDIUM })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({ description: 'Sort field', enum: ['createdAt', 'title', 'difficulty'], default: 'createdAt' })
  @IsOptional()
  @IsIn(['createdAt', 'title', 'difficulty'])
  sortBy?: 'createdAt' | 'title' | 'difficulty' = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order direction', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
