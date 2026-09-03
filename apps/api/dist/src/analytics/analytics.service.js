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
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackPageView(dto, ip, userAgent, userId) {
        return this.prisma.pageView.create({
            data: {
                path: dto.path,
                visitorId: dto.visitorId || null,
                ip: ip || null,
                userAgent: userAgent || null,
                userId: userId || null,
            },
        });
    }
    async getStats() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const totalViews = await this.prisma.pageView.count();
        const uniqueVisitorsResult = await this.prisma.pageView.groupBy({
            by: ['visitorId'],
            where: { visitorId: { not: null } },
        });
        const uniqueVisitors = uniqueVisitorsResult.length;
        const viewsToday = await this.prisma.pageView.count({
            where: { createdAt: { gte: startOfToday } },
        });
        const uniqueVisitorsTodayResult = await this.prisma.pageView.groupBy({
            by: ['visitorId'],
            where: {
                createdAt: { gte: startOfToday },
                visitorId: { not: null },
            },
        });
        const uniqueVisitorsToday = uniqueVisitorsTodayResult.length;
        const totalUsers = await this.prisma.user.count();
        const topPagesRaw = await this.prisma.pageView.groupBy({
            by: ['path'],
            _count: {
                id: true,
            },
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
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                },
            });
            const visitorsGroup = await this.prisma.pageView.groupBy({
                by: ['visitorId'],
                where: {
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                    visitorId: { not: null },
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map