import { IsString, IsNotEmpty, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class CreateAnswerDto {
  @ApiProperty({ description: 'Detailed Markdown solution content for the question', example: 'The Event Loop executes tasks from the Call Stack...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Optional code snippet demonstrating the answer', example: 'setTimeout(() => console.log("Done"), 0);' })
  @IsOptional()
  @IsString()
  codeSnippet?: string;

  @ApiPropertyOptional({ description: 'Optional deep-dive architectural explanation', example: 'Microtasks have higher priority than Macrotasks in V8 engine.' })
  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CreateQuestionDto {
  @ApiProperty({ description: 'The question title statement', example: 'What is the Event Loop in JavaScript?' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Custom URL slug (auto-generated from title if omitted)', example: 'what-is-event-loop-js' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Detailed Markdown question body text', example: 'Explain how the Call Stack and Event Loop interact with Promises.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Question difficulty level', enum: Difficulty, example: Difficulty.MEDIUM })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ description: 'Category UUID ID', example: '09d96675-16a1-4c65-83a9-b0bc4f3d41fb' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Technology UUID ID', example: 'aaa2835a-795d-41dd-ab34-5054b5ce7523' })
  @IsString()
  @IsNotEmpty()
  technologyId: string;

  @ApiPropertyOptional({ description: 'Optional initial answer model payload', type: CreateAnswerDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAnswerDto)
  answer?: CreateAnswerDto;
}
