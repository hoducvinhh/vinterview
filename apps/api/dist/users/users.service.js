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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const userSelect = {
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
};
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search) {
        const users = await this.prisma.user.findMany({
            where: search
                ? { OR: [{ email: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] }
                : undefined,
            orderBy: { createdAt: 'desc' },
            select: userSelect,
        });
        return { success: true, data: users };
    }
    async create(dto) {
        const email = dto.email.toLowerCase();
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser)
            throw new common_1.ConflictException(`User with email "${email}" already exists.`);
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
    async update(id, dto, currentUserId) {
        const existingUser = await this.prisma.user.findUnique({ where: { id } });
        if (!existingUser)
            throw new common_1.NotFoundException('User not found.');
        if (id === currentUserId && dto.role && dto.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('You cannot remove your own admin role.');
        }
        const email = dto.email?.toLowerCase();
        if (email && email !== existingUser.email) {
            const emailOwner = await this.prisma.user.findUnique({ where: { email } });
            if (emailOwner)
                throw new common_1.ConflictException(`User with email "${email}" already exists.`);
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
    async remove(id, currentUserId) {
        if (id === currentUserId)
            throw new common_1.ForbiddenException('You cannot delete your own account.');
        const existingUser = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!existingUser)
            throw new common_1.NotFoundException('User not found.');
        await this.prisma.user.delete({ where: { id } });
        return { success: true, message: 'User deleted successfully.' };
    }
    async updateSelfProfile(userId, dto) {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map