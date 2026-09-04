import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AnalyticsService {
  private adminIps: Set<string> = new Set();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  recordAdminIp(ip?: string) {
    if (ip) {
      const cleanIp = ip.replace(/^::ffff:/, '').trim();
      this.adminIps.add(cleanIp);
      this.adminIps.add(ip);
    }
  }

  async trackPageView(dto: TrackPageViewDto, ip?: string, userAgent?: string, authHeader?: string) {
    const cleanIp = ip ? ip.replace(/^::ffff:/, '').trim() : undefined;
    let userId: string | undefined;
    let isAdmin = false;

    // Decode JWT token if present in headers
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = this.jwtService.decode(token);
        if (decoded) {
          userId = decoded.sub;
          if (decoded.role === UserRole.ADMIN) {
            isAdmin = true;
          }
        }
      } catch {
        // Token decode error ignored
      }
    }

    // Double check user role from DB if userId exists
    if (userId && !isAdmin) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (user && user.role === UserRole.ADMIN) {
        isAdmin = true;
      }
    }

    // Exclude Admin users & record Admin IP
    if (isAdmin) {
      this.recordAdminIp(ip);
      return { success: true, tracked: false, reason: 'Admin user traffic excluded' };
    }

    // Exclude request if IP belongs to known Admin IP
    if ((ip && this.adminIps.has(ip)) || (cleanIp && this.adminIps.has(cleanIp))) {
      return { success: true, tracked: false, reason: 'Admin IP excluded' };
    }

    // Exclude admin dashboard routes
    if (dto.path && dto.path.startsWith('/admin')) {
      return { success: true, tracked: false, reason: 'Admin route excluded' };
    }

    // Record page view ONLY for regular non-admin visitors
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

  async getStats(adminIp?: string) {
    if (adminIp) {
      this.recordAdminIp(adminIp);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Get Admin user IDs to exclude from any legacy pageviews
    const adminUsers = await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: { id: true },
    });
    const adminUserIds = adminUsers.map((u) => u.id);
    const adminIpsList = Array.from(this.adminIps);

    const baseWhere: any = {
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

    // 1. Total Page Views
    const totalViews = await this.prisma.pageView.count({
      where: baseWhere,
    });

    // 2. Unique Visitors (count distinct visitorId & IP combination)
    const uniqueVisitorsResult = await this.prisma.pageView.groupBy({
      by: ['visitorId', 'ip'],
      where: baseWhere,
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // 3. Views Today
    const viewsToday = await this.prisma.pageView.count({
      where: {
        ...baseWhere,
        createdAt: { gte: startOfToday },
      },
    });

    // 4. Unique Visitors Today
    const uniqueVisitorsTodayResult = await this.prisma.pageView.groupBy({
      by: ['visitorId', 'ip'],
      where: {
        ...baseWhere,
        createdAt: { gte: startOfToday },
      },
    });
    const uniqueVisitorsToday = uniqueVisitorsTodayResult.length;

    // 5. Registered Users Count (EXCLUDE Admin accounts, only count regular USER role members)
    const totalUsers = await this.prisma.user.count({
      where: {
        role: UserRole.USER,
      },
    });

    // 6. Top Pages (Group by path, count descending)
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
}
