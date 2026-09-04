import { PrismaService } from '../prisma/prisma.service';
export declare class CreateCheckoutDto {
    planType?: 'MONTHLY' | 'LIFETIME';
}
export declare class PaymentService {
    private readonly prisma;
    private readonly logger;
    private payOS;
    constructor(prisma: PrismaService);
    createCheckoutSession(userId: string, dto: CreateCheckoutDto): Promise<{
        orderCode: number;
        amount: number;
        checkoutUrl: any;
        status: import("@prisma/client").$Enums.OrderStatus;
    }>;
    handleWebhook(webhookBody: any): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    checkOrderStatus(orderCode: number, userId: string): Promise<{
        status: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orderCode: number;
        amount: number;
        paymentLinkId: string | null;
        checkoutUrl: string | null;
        paidAt: Date | null;
    }>;
    getUserOrders(userId: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string;
        orderCode: number;
        amount: number;
        paymentLinkId: string | null;
        checkoutUrl: string | null;
        paidAt: Date | null;
    }[]>;
    activatePremiumDirectly(userId: string): Promise<{
        success: boolean;
        message: string;
        user: {
            email: string;
            id: string;
            isPremium: boolean;
        };
    }>;
}
