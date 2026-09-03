import { Controller, Post, Get, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('progress')
@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('questions/:id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update learning progress status for a question' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully.' })
  @ApiNotFoundResponse({ description: 'Question not found.' })
  updateProgress(
    @Param('id') questionId: string,
    @Body() dto: UpdateProgressDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.progressService.updateProgress(userId, questionId, dto.status);
  }

  @Get('users/me/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user learning progress statistics' })
  @ApiResponse({ status: 200, description: 'User learning stats and recently completed questions.' })
  getUserProgress(@CurrentUser('id') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Get('users/me/progress/map')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user question progress dictionary map' })
  @ApiResponse({ status: 200, description: 'Dictionary mapping questionId -> ProgressStatus.' })
  async getUserProgressMap(@CurrentUser('id') userId: string) {
    const map = await this.progressService.getUserProgressMap(userId);
    return { success: true, data: map };
  }
}
