import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    trackPageView(dto: TrackPageViewDto, req: Request): Promise<{
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
