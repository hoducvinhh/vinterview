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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const jwt_1 = require("@nestjs/jwt");
let AnalyticsService = class AnalyticsService {
    prisma;
    jwtService;
    adminIps = new Set();
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    recordAdminIp(ip) {
        if (ip) {
            const cleanIp = ip.replace(/^::ffff:/, '').trim();
            this.adminIps.add(cleanIp);
            this.adminIps.add(ip);
        }
    }
    async trackPageView(dto, ip, userAgent, authHeader) {
        const cleanIp = ip ? ip.replace(/^::ffff:/, '').trim() : undefined;
        let userId;
        let isAdmin = false;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = this.jwtService.decode(token);
                if (decoded) {
                    userId = decoded.sub;
                    if (decoded.role === client_1.UserRole.ADMIN) {
                        isAdmin = true;
                    }
                }
            }
            catch {
            }
        }
        if (userId && !isAdmin) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (user && user.role === client_1.UserRole.ADMIN) {
                isAdmin = true;
            }
        }
        if (isAdmin) {
            this.recordAdminIp(ip);
            return { success: true, tracked: false, reason: 'Admin user traffic excluded' };
        }
        if ((ip && this.adminIps.has(ip)) || (cleanIp && this.adminIps.has(cleanIp))) {
            return { success: true, tracked: false, reason: 'Admin IP excluded' };
        }
        if (dto.path && dto.path.startsWith('/admin')) {
            return { success: true, tracked: false, reason: 'Admin route excluded' };
        }
        return this.prisma.pageView.create({
            data: {
                path: dto.path,
                visitorId: dto.visitorId || null,
                ip: cleanIp || ip || null,
                userAgent: userAgent || null,
                userId: userId || null,
            },
        });
    }
    async resetStats() {
        await this.prisma.pageView.deleteMany({});
        return { success: true, message: 'Dữ liệu thống kê đã được reset về 0 thành công!' };
    }
    async getStats(adminIp) {
        if (adminIp) {
            this.recordAdminIp(adminIp);
        }
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const adminUsers = await this.prisma.user.findMany({
            where: { role: client_1.UserRole.ADMIN },
            select: { id: true },
        });
        const adminUserIds = adminUsers.map((u) => u.id);
        const adminIpsList = Array.from(this.adminIps);
        const baseWhere = {
            path: {
                not: {
                    startsWith: '/admin',
                },
            },
        };
        if (adminUserIds.length > 0) {
            baseWhere.userId = {
                notIn: adminUserIds,
            };
        }
        if (adminIpsList.length > 0) {
            baseWhere.ip = {
                notIn: adminIpsList,
            };
        }
        const totalViews = await this.prisma.pageView.count({
            where: baseWhere,
        });
        const uniqueVisitorsResult = await this.prisma.pageView.groupBy({
            by: ['visitorId', 'ip'],
            where: baseWhere,
        });
        const uniqueVisitors = uniqueVisitorsResult.length;
        const viewsToday = await this.prisma.pageView.count({
            where: {
                ...baseWhere,
                createdAt: { gte: startOfToday },
            },
        });
        const uniqueVisitorsTodayResult = await this.prisma.pageView.groupBy({
            by: ['visitorId', 'ip'],
            where: {
                ...baseWhere,
                createdAt: { gte: startOfToday },
            },
        });
        const uniqueVisitorsToday = uniqueVisitorsTodayResult.length;
        const totalUsers = await this.prisma.user.count({
            where: {
                role: client_1.UserRole.USER,
            },
        });
        const topPagesRaw = await this.prisma.pageView.groupBy({
            by: ['path'],
            _count: {
                id: true,
            },
            where: baseWhere,
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 8,
        });
        const topPages = topPagesRaw.map((item) => ({
            path: item.path,
            views: item._count.id,
            percentage: totalViews > 0 ? Math.round((item._count.id / totalViews) * 100) : 0,
        }));
        const dailyStats = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date();
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
            const viewsCount = await this.prisma.pageView.count({
                where: {
                    ...baseWhere,
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                },
            });
            const visitorsGroup = await this.prisma.pageView.groupBy({
                by: ['visitorId', 'ip'],
                where: {
                    ...baseWhere,
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                },
            });
            const dateLabel = `${dayStart.getDate()}/${dayStart.getMonth() + 1}`;
            dailyStats.push({
                date: dateLabel,
                views: viewsCount,
                visitors: visitorsGroup.length,
            });
        }
        return {
            totalViews,
            uniqueVisitors,
            viewsToday,
            uniqueVisitorsToday,
            totalUsers,
            topPages,
            dailyStats,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map