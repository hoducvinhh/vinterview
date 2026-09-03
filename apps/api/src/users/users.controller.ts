import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch('me/profile')
    @Roles(UserRole.USER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update current user profile' })
    updateProfile(@CurrentUser() currentUser: { id: string }, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateSelfProfile(currentUser.id, dto);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll(@Query('search') search?: string) {
        return this.usersService.findAll(search);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() currentUser: { id: string }) {
        return this.usersService.update(id, dto, currentUser.id);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string, @CurrentUser() currentUser: { id: string }) {
        return this.usersService.remove(id, currentUser.id);
    }
}