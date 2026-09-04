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
            email: string;
            name: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
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
    findAll(search?: string): Promise<{
        success: boolean;
        data: {
            email: string;
            name: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
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
            email: string;
            name: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
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
    update(id: string, dto: UpdateUserDto, currentUser: {
        id: string;
    }): Promise<{
        success: boolean;
        data: {
            email: string;
            name: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPremium: boolean;
            premiumExpiresAt: Date | null;
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
    remove(id: string, currentUser: {
        id: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
