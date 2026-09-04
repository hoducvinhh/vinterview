"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PremiumGuard = class PremiumGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.id) {
            throw new common_1.ForbiddenException('Bạn cần đăng nhập để truy cập tính năng này.');
        }
        const dbUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { isPremium: true, premiumExpiresAt: true, role: true },
        });
        if (!dbUser) {
            throw new common_1.ForbiddenException('Người dùng không tồn tại.');
        }
        if (dbUser.role === 'ADMIN') {
            return true;
        }
        if (!dbUser.isPremium) {
            throw new common_1.ForbiddenException({
                message: 'Tính năng Phân tích CV bằng AI là tính năng dành riêng cho tài khoản Premium. Vui lòng nâng cấp tài khoản để sử dụng!',
                isPremiumRequired: true,
                code: 'PREMIUM_REQUIRED',
            });
        }
        if (dbUser.premiumExpiresAt && new Date(dbUser.premiumExpiresAt) < new Date()) {
            throw new common_1.ForbiddenException({
                message: 'Gói Premium của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng tính năng này!',
                isPremiumRequired: true,
                code: 'PREMIUM_EXPIRED',
            });
        }
        return true;
    }
};
exports.PremiumGuard = PremiumGuard;
exports.PremiumGuard = PremiumGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PremiumGuard);
//# sourceMappingURL=premium.guard.js.map