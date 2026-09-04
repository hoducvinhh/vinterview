import { PaymentService, CreateCheckoutDto } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createCheckout(userId: string, dto: CreateCheckoutDto): Promise<{
        orderCode: number;
        amount: number;
        checkoutUrl: any;
        status: import("@prisma/client").$Enums.OrderStatus;
    }>;
    handleWebhook(body: any): Promise<{
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
    testActivatePremium(userId: string): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            isPremium: boolean;
        };
    }>;
}
