import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    create(dto: CreateUserDto): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: string, dto: UpdateUserDto, currentUserId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: string, currentUserId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateSelfProfile(userId: string, dto: UpdateProfileDto): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
