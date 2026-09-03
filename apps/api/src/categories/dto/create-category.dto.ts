import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category Name', example: 'System Architecture' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Custom URL Slug (auto-generated if omitted)', example: 'system-architecture' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Category Description', example: 'System design and architectural patterns' })
  @IsOptional()
  @IsString()
  description?: string;
}
