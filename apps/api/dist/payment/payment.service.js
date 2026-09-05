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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = exports.CreateCheckoutDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PayOSModule = require('@payos/node');
const PayOS = PayOSModule.default || PayOSModule;
class CreateCheckoutDto {
}
exports.CreateCheckoutDto = CreateCheckoutDto;
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PaymentService_1.name);
        const clientId = process.env.PAYOS_CLIENT_ID;
        const apiKey = process.env.PAYOS_API_KEY;
        const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
        if (clientId && apiKey && checksumKey) {
            try {
                this.payOS = new PayOS(clientId, apiKey, checksumKey);
                this.logger.log('Khởi tạo PayOS SDK thành công!');
            }
            catch (err) {
                this.logger.error(`Lỗi khi khởi tạo PayOS SDK: ${err.message}`);
            }
        }
        else {
            this.logger.warn('Chưa cấu hình đầy đủ biến môi trường PayOS (PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY).');
        }
    }
    async createCheckoutSession(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại.');
        }
        const amount = dto.planType === 'MONTHLY' ? 99000 : 199000;
        const planName = dto.planType === 'MONTHLY' ? 'Premium 1 Thang' : 'Premium Tron Doi';
        const description = `Upgrade ${planName}`.slice(0, 25);
        const orderCode = Math.floor(100000 + Math.random() * 90000000);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const returnUrl = process.env.PAYOS_RETURN_URL || `${frontendUrl}/payment/success?orderCode=${orderCode}`;
        const cancelUrl = process.env.PAYOS_CANCEL_URL || `${frontendUrl}/payment/cancel?orderCode=${orderCode}`;
        let paymentData;
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
            }
            catch (err) {
                this.logger.error(`Lỗi từ PayOS createPaymentLink: ${err.message}`);
                throw new common_1.BadRequestException(`Tạo liên kết thanh toán PayOS thất bại: ${err.message}`);
            }
        }
        else {
            this.logger.warn('PayOS SDK chưa được cấu hình. Đang dùng Checkout Demo.');
            paymentData = {
                checkoutUrl: `${frontendUrl}/payment/success?orderCode=${orderCode}&demo=true`,
                paymentLinkId: `demo-${orderCode}`,
            };
        }
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
    async handleWebhook(webhookBody) {
        this.logger.log(`Nhận Webhook PayOS: ${JSON.stringify(webhookBody)}`);
        let verifiedData = webhookBody.data;
        if (this.payOS && webhookBody.signature) {
            try {
                verifiedData = this.payOS.verifyPaymentWebhookData(webhookBody);
            }
            catch (err) {
                this.logger.error(`Xác thực Webhook PayOS thất bại: ${err.message}`);
                throw new common_1.BadRequestException('Chữ ký Webhook không hợp lệ.');
            }
        }
        if (!verifiedData || !verifiedData.orderCode) {
            return { success: false, message: 'Dữ liệu Webhook rỗng hoặc thiếu orderCode' };
        }
        const orderCode = Number(verifiedData.orderCode);
        const code = verifiedData.code;
        const order = await this.prisma.order.findUnique({
            where: { orderCode },
            include: { user: true },
        });
        if (!order) {
            this.logger.warn(`Không tìm thấy đơn hàng với orderCode: ${orderCode}`);
            return { success: false, message: 'Order không tồn tại' };
        }
        if (code === '00' || verifiedData.desc === 'success' || webhookBody.success === true) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'SUCCESS',
                    paidAt: new Date(),
                },
            });
            await this.prisma.user.update({
                where: { id: order.userId },
                data: {
                    isPremium: true,
                    premiumExpiresAt: null,
                },
            });
            this.logger.log(`Mở khóa Premium thành công cho User ID: ${order.userId} (Order ${orderCode})`);
        }
        else {
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: 'CANCELLED' },
            });
        }
        return { success: true };
    }
    async checkOrderStatus(orderCode, userId) {
        const order = await this.prisma.order.findUnique({
            where: { orderCode },
        });
        if (!order || order.userId !== userId) {
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng.');
        }
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
            }
            catch (e) {
                this.logger.warn(`Lỗi khi kiểm tra trạng thái từ PayOS: ${e.message}`);
            }
        }
        return order;
    }
    async getUserOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async activatePremiumDirectly(userId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { isPremium: true },
            select: { id: true, email: true, isPremium: true },
        });
        return { success: true, message: 'Đã kích hoạt Premium thành công!', user };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map