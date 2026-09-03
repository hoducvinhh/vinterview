import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all technologies with question counts' })
  @ApiResponse({ status: 200, description: 'List of all technologies' })
  findAll() {
    return this.technologiesService.findAll();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get technology detail by ID or Slug' })
  @ApiResponse({ status: 200, description: 'Technology detail' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.technologiesService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new technology (Admin Only)' })
  @ApiResponse({ status: 201, description: 'Technology created' })
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologiesService.create(createTechnologyDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update technology (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Technology updated' })
  update(@Param('id') id: string, @Body() updateTechnologyDto: UpdateTechnologyDto) {
    return this.technologiesService.update(id, updateTechnologyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete technology (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Technology deleted' })
  remove(@Param('id') id: string) {
    return this.technologiesService.remove(id);
  }
}
