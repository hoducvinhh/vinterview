import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('Bạn cần đăng nhập để truy cập tính năng này.');
    }

    // Query latest user status from DB to ensure fresh status
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { isPremium: true, premiumExpiresAt: true, role: true },
    });

    if (!dbUser) {
      throw new ForbiddenException('Người dùng không tồn tại.');
    }

    // Admin always has premium access
    if (dbUser.role === 'ADMIN') {
      return true;
    }

    if (!dbUser.isPremium) {
      throw new ForbiddenException({
        message: 'Tính năng Phân tích CV bằng AI là tính năng dành riêng cho tài khoản Premium. Vui lòng nâng cấp tài khoản để sử dụng!',
        isPremiumRequired: true,
        code: 'PREMIUM_REQUIRED',
      });
    }

    if (dbUser.premiumExpiresAt && new Date(dbUser.premiumExpiresAt) < new Date()) {
      throw new ForbiddenException({
        message: 'Gói Premium của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng tính năng này!',
        isPremiumRequired: true,
        code: 'PREMIUM_EXPIRED',
      });
    }

    return true;
  }
}
