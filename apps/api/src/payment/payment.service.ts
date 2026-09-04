import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PayOS = require('@payos/node');

export class CreateCheckoutDto {
  planType?: 'MONTHLY' | 'LIFETIME';
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private payOS: any;

  constructor(private readonly prisma: PrismaService) {
    const clientId = process.env.PAYOS_CLIENT_ID;
    const apiKey = process.env.PAYOS_API_KEY;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

    if (clientId && apiKey && checksumKey) {
      try {
        this.payOS = new PayOS(clientId, apiKey, checksumKey);
        this.logger.log('Khởi tạo PayOS SDK thành công!');
      } catch (err: any) {
        this.logger.error(`Lỗi khi khởi tạo PayOS SDK: ${err.message}`);
      }
    } else {
      this.logger.warn('Chưa cấu hình đầy đủ biến môi trường PayOS (PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY).');
    }
  }

  async createCheckoutSession(userId: string, dto: CreateCheckoutDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    // Giá gói Premium
    const amount = dto.planType === 'MONTHLY' ? 99000 : 199000;
    const planName = dto.planType === 'MONTHLY' ? 'Premium 1 Thang' : 'Premium Tron Doi';
    const description = `Upgrade ${planName}`.slice(0, 25);

    // Tạo orderCode ngẫu nhiên duy nhất (số nguyên)
    const orderCode = Math.floor(100000 + Math.random() * 90000000);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const returnUrl = process.env.PAYOS_RETURN_URL || `${frontendUrl}/payment/success?orderCode=${orderCode}`;
    const cancelUrl = process.env.PAYOS_CANCEL_URL || `${frontendUrl}/payment/cancel?orderCode=${orderCode}`;

    let paymentData: any;

    if (this.payOS) {
      try {
        const payosBody = {
          orderCode,
          amount,
          description,
          items: [
            {
              name: `Gói ${planName}`,
              quantity: 1,
              price: amount,
            },
          ],
          returnUrl,
          cancelUrl,
        };

        paymentData = await this.payOS.createPaymentLink(payosBody);
      } catch (err: any) {
        this.logger.error(`Lỗi từ PayOS createPaymentLink: ${err.message}`);
        throw new BadRequestException(`Tạo liên kết thanh toán PayOS thất bại: ${err.message}`);
      }
    } else {
      // Demo Mode khi chưa nhập Keys PayOS
      this.logger.warn('PayOS SDK chưa được cấu hình. Đang dùng Checkout Demo.');
      paymentData = {
        checkoutUrl: `${frontendUrl}/payment/success?orderCode=${orderCode}&demo=true`,
        paymentLinkId: `demo-${orderCode}`,
      };
    }

    // Lưu đơn hàng vào CSDL
    const order = await this.prisma.order.create({
      data: {
        orderCode,
        userId,
        amount,
        description,
        status: 'PENDING',
        paymentLinkId: paymentData.paymentLinkId || null,
        checkoutUrl: paymentData.checkoutUrl || null,
      },
    });

    return {
      orderCode: order.orderCode,
      amount: order.amount,
      checkoutUrl: paymentData.checkoutUrl,
      status: order.status,
    };
  }

  async handleWebhook(webhookBody: any) {
    this.logger.log(`Nhận Webhook PayOS: ${JSON.stringify(webhookBody)}`);

    let verifiedData: any = webhookBody.data;

    if (this.payOS && webhookBody.signature) {
      try {
        verifiedData = this.payOS.verifyPaymentWebhookData(webhookBody);
      } catch (err: any) {
        this.logger.error(`Xác thực Webhook PayOS thất bại: ${err.message}`);
        throw new BadRequestException('Chữ ký Webhook không hợp lệ.');
      }
    }

    if (!verifiedData || !verifiedData.orderCode) {
      return { success: false, message: 'Dữ liệu Webhook rỗng hoặc thiếu orderCode' };
    }

    const orderCode = Number(verifiedData.orderCode);
    const code = verifiedData.code; // '00' là thành công

    const order = await this.prisma.order.findUnique({
      where: { orderCode },
      include: { user: true },
    });

    if (!order) {
      this.logger.warn(`Không tìm thấy đơn hàng với orderCode: ${orderCode}`);
      return { success: false, message: 'Order không tồn tại' };
    }

    if (code === '00' || verifiedData.desc === 'success' || webhookBody.success === true) {
      // Cập nhật Order = SUCCESS
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'SUCCESS',
          paidAt: new Date(),
        },
      });

      // Mở khóa Premium cho User
      await this.prisma.user.update({
        where: { id: order.userId },
        data: {
          isPremium: true,
          // Nếu là gói tháng thì cộng thêm 30 ngày, nếu không set null = trọn đời
          premiumExpiresAt: null,
        },
      });

      this.logger.log(`Mở khóa Premium thành công cho User ID: ${order.userId} (Order ${orderCode})`);
    } else {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });
    }

    return { success: true };
  }

  async checkOrderStatus(orderCode: number, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderCode },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Không tìm thấy đơn hàng.');
    }

    // Nếu vẫn đang PENDING và có PayOS SDK, query thử từ PayOS
    if (order.status === 'PENDING' && this.payOS) {
      try {
        const paymentInfo = await this.payOS.getPaymentLinkInformation(orderCode);
        if (paymentInfo && paymentInfo.status === 'PAID') {
          await this.prisma.order.update({
            where: { id: order.id },
            data: { status: 'SUCCESS', paidAt: new Date() },
          });

          await this.prisma.user.update({
            where: { id: userId },
            data: { isPremium: true },
          });

          return { ...order, status: 'SUCCESS' };
        }
      } catch (e: any) {
        this.logger.warn(`Lỗi khi kiểm tra trạng thái từ PayOS: ${e.message}`);
      }
    }

    return order;
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Phương thức hỗ trợ kích hoạt Premium trực tiếp (Cho mục đích Test hoặc Admin)
  async activatePremiumDirectly(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isPremium: true },
      select: { id: true, email: true, isPremium: true },
    });
    return { success: true, message: 'Đã kích hoạt Premium thành công!', user };
  }
}
