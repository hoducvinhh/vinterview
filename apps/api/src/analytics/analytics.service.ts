import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackPageView(dto: TrackPageViewDto, ip?: string, userAgent?: string, userId?: string) {
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

    // 1. Total Page Views
    const totalViews = await this.prisma.pageView.count();

    // 2. Unique Visitors (count distinct visitorId & IP combination)
    const uniqueVisitorsResult = await this.prisma.pageView.groupBy({
      by: ['visitorId', 'ip'],
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // 3. Views Today
    const viewsToday = await this.prisma.pageView.count({
      where: { createdAt: { gte: startOfToday } },
    });

    // 4. Unique Visitors Today
    const uniqueVisitorsTodayResult = await this.prisma.pageView.groupBy({
      by: ['visitorId', 'ip'],
      where: {
        createdAt: { gte: startOfToday },
      },
    });
    const uniqueVisitorsToday = uniqueVisitorsTodayResult.length;

    // 5. Registered Users Count
    const totalUsers = await this.prisma.user.count();

    // 6. Top Pages (Group by path, count descending)
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

    // 7. Daily Stats for past 7 days
    const dailyStats: Array<{ date: string; views: number; visitors: number }> = [];
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
        by: ['visitorId', 'ip'],
        where: {
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
}
