import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProgressStatus } from '@prisma/client';

export class UpdateProgressDto {
  @ApiProperty({ description: 'Learning progress status', enum: ProgressStatus, example: ProgressStatus.COMPLETED })
  @IsEnum(ProgressStatus)
  @IsNotEmpty()
  status: ProgressStatus;
}
