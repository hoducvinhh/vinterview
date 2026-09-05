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
        id: string;
        orderCode: number;
        amount: number;
        description: string;
        paymentLinkId: string | null;
        checkoutUrl: string | null;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getUserOrders(userId: string): Promise<{
        id: string;
        orderCode: number;
        amount: number;
        description: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentLinkId: string | null;
        checkoutUrl: string | null;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    activatePremiumDirectly(userId: string): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            isPremium: boolean;
        };
    }>;
}
