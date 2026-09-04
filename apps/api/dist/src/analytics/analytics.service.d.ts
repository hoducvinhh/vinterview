import { PrismaService } from '../prisma/prisma.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    trackPageView(dto: TrackPageViewDto, ip?: string, userAgent?: string, userId?: string): Promise<{
        id: string;
        path: string;
        visitorId: string | null;
        ip: string | null;
        userAgent: string | null;
        userId: string | null;
        createdAt: Date;
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
