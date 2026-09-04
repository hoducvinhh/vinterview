import { PrismaService } from '../prisma/prisma.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    trackPageView(dto: TrackPageViewDto, ip?: string, userAgent?: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        path: string;
        visitorId: string | null;
        ip: string | null;
        userAgent: string | null;
    }>;
    getStats(): Promise<{
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
