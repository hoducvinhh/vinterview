import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(currentUser: {
        id: string;
    }, dto: UpdateProfileDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
        };
    }>;
    findAll(search?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
        }[];
    }>;
    create(dto: CreateUserDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
        };
    }>;
    update(id: string, dto: UpdateUserDto, currentUser: {
        id: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
            avatarUrl: string | null;
            headline: string | null;
            bio: string | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            websiteUrl: string | null;
        };
    }>;
    remove(id: string, currentUser: {
        id: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
