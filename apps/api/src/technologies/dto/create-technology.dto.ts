import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnologyDto {
  @ApiProperty({ description: 'Technology Name', example: 'GraphQL' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Custom URL Slug (auto-generated if omitted)', example: 'graphql' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Icon Emoji or Asset Identifier', example: '🕸️' })
  @IsOptional()
  @IsString()
  icon?: string;
}
