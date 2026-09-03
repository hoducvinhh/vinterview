import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { InterviewService } from './interview.service';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@ApiTags('interview')
@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a new practice interview session' })
  @ApiResponse({ status: 200, description: 'Interview session created with randomized questions.' })
  @ApiNotFoundResponse({ description: 'No questions found matching specified filters.' })
  startInterview(@Body() startDto: StartInterviewDto) {
    return this.interviewService.startInterview(startDto);
  }

  @Post(':id/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit question answer & self-rating for interview session' })
  @ApiResponse({ status: 200, description: 'Answer recorded and expected solution returned.' })
  @ApiNotFoundResponse({ description: 'Interview session not found or expired.' })
  submitAnswer(@Param('id') sessionId: string, @Body() submitDto: SubmitAnswerDto) {
    return this.interviewService.submitAnswer(sessionId, submitDto);
  }

  @Get(':id/result')
  @ApiOperation({ summary: 'Get interview session final result & score breakdown' })
  @ApiResponse({ status: 200, description: 'Interview score breakdown and readiness grade.' })
  @ApiNotFoundResponse({ description: 'Interview session not found or expired.' })
  getResult(@Param('id') sessionId: string) {
    return this.interviewService.getResult(sessionId);
  }
}
