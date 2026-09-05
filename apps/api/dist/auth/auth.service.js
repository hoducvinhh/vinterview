"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    googleClient;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException(`User with email "${dto.email}" already exists.`);
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                password: hashedPassword,
                name: dto.name,
                role: client_1.UserRole.USER,
            },
            select: {
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
            },
        });
        const accessToken = this.generateToken(user.id, user.email, user.role);
        return {
            success: true,
            message: 'User registered successfully',
            accessToken,
            user,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('This account was created with Google. Please use Google Sign-In.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const accessToken = this.generateToken(user.id, user.email, user.role);
        const userProfile = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isPremium: user.isPremium,
            premiumExpiresAt: user.premiumExpiresAt,
            avatarUrl: user.avatarUrl,
            headline: user.headline,
            bio: user.bio,
            githubUrl: user.githubUrl,
            linkedinUrl: user.linkedinUrl,
            websiteUrl: user.websiteUrl,
            createdAt: user.createdAt,
        };
        return {
            success: true,
            message: 'Login successful',
            accessToken,
            user: userProfile,
        };
    }
    async googleLogin(idToken) {
        let ticket;
        try {
            ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Google ID token.');
        }
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new common_1.UnauthorizedException('Invalid payload from Google ID token.');
        }
        const { sub: googleId, email, name, picture: avatarUrl } = payload;
        const lowerEmail = email.toLowerCase();
        let user = await this.prisma.user.findFirst({
            where: {
                OR: [{ googleId }, { email: lowerEmail }],
            },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: lowerEmail,
                    name: name || 'Google User',
                    googleId,
                    avatarUrl,
                    role: client_1.UserRole.USER,
                },
            });
        }
        else {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    googleId,
                    avatarUrl: avatarUrl || user.avatarUrl,
                    name: user.name || name,
                },
            });
        }
        const accessToken = this.generateToken(user.id, user.email, user.role);
        const userProfile = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isPremium: user.isPremium,
            premiumExpiresAt: user.premiumExpiresAt,
            avatarUrl: user.avatarUrl,
            headline: user.headline,
            bio: user.bio,
            githubUrl: user.githubUrl,
            linkedinUrl: user.linkedinUrl,
            websiteUrl: user.websiteUrl,
            createdAt: user.createdAt,
        };
        return {
            success: true,
            message: 'Google login successful',
            accessToken,
            user: userProfile,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isPremium: true,
                premiumExpiresAt: true,
                avatarUrl: true,
                headline: true,
                bio: true,
                githubUrl: true,
                linkedinUrl: true,
                websiteUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User profile not found.');
        }
        return {
            success: true,
            data: user,
        };
    }
    generateToken(userId, email, role) {
        return this.jwtService.sign({
            sub: userId,
            email,
            role,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map