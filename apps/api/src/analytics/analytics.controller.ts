import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserRole } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record a page view (Public)',
    description: 'Tracks page visits with optional visitor identifier, user agent, and IP.',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Page view recorded successfully.' })
  trackPageView(@Body() dto: TrackPageViewDto, @Req() req: Request) {
    const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp;
    const userAgent = req.headers['user-agent'];
    const userId = (req as any).user?.id;

    return this.analyticsService.trackPageView(dto, ip, userAgent, userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get website analytics statistics (Admin Only)',
    description: 'Returns total pageviews, unique visitors count, daily breakdown, and top pages.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Analytics statistics retrieved.' })
  getStats() {
    return this.analyticsService.getStats();
  }
}
