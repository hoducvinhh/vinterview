import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class StartInterviewDto {
  @ApiPropertyOptional({ description: 'Filter by Technology ID or Slug', example: 'javascript' })
  @IsOptional()
  @IsString()
  technology?: string;

  @ApiPropertyOptional({ description: 'Filter by Category ID or Slug', example: 'frontend-development' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by Difficulty', enum: Difficulty, example: Difficulty.MEDIUM })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({ description: 'Number of questions in interview session', default: 5, minimum: 1, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  questionCount?: number = 5;
}
