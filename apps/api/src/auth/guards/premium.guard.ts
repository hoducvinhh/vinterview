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

    // Tạm thời cho phép tất cả người dùng sử dụng miễn phí (bỏ qua kiểm tra isPremium)
    return true;
  }
}
