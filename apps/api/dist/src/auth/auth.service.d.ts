import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
    }>;
    getProfile(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    private generateToken;
}
