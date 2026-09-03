import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
    login(loginDto: LoginDto): Promise<{
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
    getProfile(user: any): Promise<{
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
}
