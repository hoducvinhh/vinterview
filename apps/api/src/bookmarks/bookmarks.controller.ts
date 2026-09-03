import { Controller, Post, Delete, Get, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('bookmarks')
@Controller()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('questions/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bookmark a question (Authenticated User)' })
  @ApiResponse({ status: 201, description: 'Question bookmarked successfully.' })
  @ApiNotFoundResponse({ description: 'Question not found.' })
  @ApiConflictResponse({ description: 'Question is already bookmarked.' })
  createBookmark(@Param('id') questionId: string, @CurrentUser('id') userId: string) {
    return this.bookmarksService.createBookmark(userId, questionId);
  }

  @Delete('questions/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a bookmark from question (Authenticated User)' })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully.' })
  @ApiNotFoundResponse({ description: 'Bookmark not found for this question.' })
  removeBookmark(@Param('id') questionId: string, @CurrentUser('id') userId: string) {
    return this.bookmarksService.removeBookmark(userId, questionId);
  }

  @Get('users/me/bookmarks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user bookmarked questions' })
  @ApiResponse({ status: 200, description: 'List of bookmarked questions.' })
  getUserBookmarks(@CurrentUser('id') userId: string) {
    return this.bookmarksService.getUserBookmarks(userId);
  }

  @Get('users/me/bookmarks/ids')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of bookmarked question IDs' })
  @ApiResponse({ status: 200, description: 'Array of bookmarked question IDs.' })
  async getUserBookmarkIds(@CurrentUser('id') userId: string) {
    const ids = await this.bookmarksService.getUserBookmarkIds(userId);
    return { success: true, data: ids };
  }
}
