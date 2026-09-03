import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { InterviewModule } from '../interview/interview.module';

@Module({
  imports: [InterviewModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
