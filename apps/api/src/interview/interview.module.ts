import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { AiEvaluatorService } from './ai-evaluator.service';

@Module({
  controllers: [InterviewController],
  providers: [InterviewService, AiEvaluatorService],
  exports: [InterviewService, AiEvaluatorService],
})
export class InterviewModule {}

