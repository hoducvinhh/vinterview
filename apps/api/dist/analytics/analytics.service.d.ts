import { PrismaService } from '../prisma/prisma.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly jwtService;
    private adminIps;
    constructor(prisma: PrismaService, jwtService: JwtService);
    recordAdminIp(ip?: string): void;
    trackPageView(dto: TrackPageViewDto, ip?: string, userAgent?: string, authHeader?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        path: string;
        visitorId: string | null;
        ip: string | null;
        userAgent: string | null;
    } | {
        success: boolean;
        tracked: boolean;
        reason: string;
    }>;
    resetStats(): Promise<{
        success: boolean;
        message: string;
    }>;
    getStats(adminIp?: string): Promise<{
        totalViews: number;
        uniqueVisitors: number;
        viewsToday: number;
        uniqueVisitorsToday: number;
        totalUsers: number;
        topPages: {
            path: string;
            views: number;
            percentage: number;
        }[];
        dailyStats: {
            date: string;
            views: number;
            visitors: number;
        }[];
    }>;
}
