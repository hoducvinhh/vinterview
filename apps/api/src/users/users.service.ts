import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UpdateProfileDto } from './dto/update-profile.dto';

const userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    avatarUrl: true,
    headline: true,
    bio: true,
    githubUrl: true,
    linkedinUrl: true,
    websiteUrl: true,
    createdAt: true,
    updatedAt: true,
} as const;

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string) {
        const users = await this.prisma.user.findMany({
            where: search
                ? { OR: [{ email: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] }
                : undefined,
            orderBy: { createdAt: 'desc' },
            select: userSelect,
        });

        return { success: true, data: users };
    }

    async create(dto: CreateUserDto) {
        const email = dto.email.toLowerCase();
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new ConflictException(`User with email "${email}" already exists.`);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(dto.password, 10),
                name: dto.name,
                role: dto.role,
            },
            select: userSelect,
        });

        return { success: true, data: user };
    }

    async update(id: string, dto: UpdateUserDto, currentUserId: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { id } });
        if (!existingUser) throw new NotFoundException('User not found.');
        if (id === currentUserId && dto.role && dto.role !== 'ADMIN') {
            throw new ForbiddenException('You cannot remove your own admin role.');
        }

        const email = dto.email?.toLowerCase();
        if (email && email !== existingUser.email) {
            const emailOwner = await this.prisma.user.findUnique({ where: { email } });
            if (emailOwner) throw new ConflictException(`User with email "${email}" already exists.`);
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...(email !== undefined && { email }),
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.role !== undefined && { role: dto.role }),
                ...(dto.password && { password: await bcrypt.hash(dto.password, 10) }),
            },
            select: userSelect,
        });

        return { success: true, data: user };
    }

    async remove(id: string, currentUserId: string) {
        if (id === currentUserId) throw new ForbiddenException('You cannot delete your own account.');
        const existingUser = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!existingUser) throw new NotFoundException('User not found.');

        await this.prisma.user.delete({ where: { id } });
        return { success: true, message: 'User deleted successfully.' };
    }

    async updateSelfProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.headline !== undefined && { headline: dto.headline }),
                ...(dto.bio !== undefined && { bio: dto.bio }),
                ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
                ...(dto.githubUrl !== undefined && { githubUrl: dto.githubUrl }),
                ...(dto.linkedinUrl !== undefined && { linkedinUrl: dto.linkedinUrl }),
                ...(dto.websiteUrl !== undefined && { websiteUrl: dto.websiteUrl }),
            },
            select: userSelect,
        });
        return { success: true, data: user };
    }
}