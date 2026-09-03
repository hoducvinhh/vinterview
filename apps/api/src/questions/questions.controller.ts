import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { QuestionsService } from './questions.service';
import { QueryQuestionsDto } from './dto/query-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get paginated list of questions',
    description: 'Retrieves questions supporting full-text title search, filtering by category/technology/difficulty, and custom sorting.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of questions retrieved successfully.',
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters supplied.' })
  findAll(@Query() query: QueryQuestionsDto) {
    return this.questionsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get single question by slug',
    description: 'Retrieves complete question details including category, technology, and answer model using unique URL slug or UUID.',
  })
  @ApiParam({ name: 'slug', description: 'Unique question URL slug or UUID ID', example: 'javascript-event-loop-asynchronous-operations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Question retrieved successfully.',
  })
  @ApiNotFoundResponse({ description: 'Question with specified slug not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.questionsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new interview question (Admin Only)',
    description: 'Creates a new question statement, automatically generates a slug if omitted, and links Category, Technology, and optional Answer.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Question created successfully.',
  })
  @ApiBadRequestResponse({ description: 'Validation failed on request body DTO.' })
  @ApiNotFoundResponse({ description: 'Referenced Category or Technology ID not found.' })
  @ApiConflictResponse({ description: 'Question with generated/provided slug already exists.' })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an existing question (Admin Only)',
    description: 'Updates specific question attributes or nested answer by UUID.',
  })
  @ApiParam({ name: 'id', description: 'Question UUID', example: 'c1a30677-18fa-4d26-b2d0-6b89fd434c6d' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Question updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Question, Category, or Technology with specified ID not found.' })
  @ApiConflictResponse({ description: 'New slug collides with an existing question.' })
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a question by ID (Admin Only)',
    description: 'Removes question and automatically cascades deletion of its canonical answer model.',
  })
  @ApiParam({ name: 'id', description: 'Question UUID', example: 'c1a30677-18fa-4d26-b2d0-6b89fd434c6d' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Question deleted successfully.',
  })
  @ApiNotFoundResponse({ description: 'Question with specified ID not found.' })
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
