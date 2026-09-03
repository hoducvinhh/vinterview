import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({ description: 'Question UUID ID', example: 'c1a30677-18fa-4d26-b2d0-6b89fd434c6d' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ description: 'User typed text answer', example: 'The Event Loop handles asynchronous callbacks via Microtask and Macrotask queues...' })
  @IsString()
  userAnswer: string;

  @ApiProperty({ description: 'Self-rating score (1 = Low, 5 = High)', minimum: 1, maximum: 5, example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
