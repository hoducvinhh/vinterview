import { Controller, Post, Get, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PaymentService, CreateCheckoutDto } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.paymentService.createCheckoutSession(userId, dto);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    return this.paymentService.handleWebhook(body);
  }

  @Get('status/:orderCode')
  @UseGuards(JwtAuthGuard)
  async checkOrderStatus(
    @Param('orderCode', ParseIntPipe) orderCode: number,
    @CurrentUser('id') userId: string,
  ) {
    return this.paymentService.checkOrderStatus(orderCode, userId);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@CurrentUser('id') userId: string) {
    return this.paymentService.getUserOrders(userId);
  }

  @Post('test-activate')
  @UseGuards(JwtAuthGuard)
  async testActivatePremium(@CurrentUser('id') userId: string) {
    return this.paymentService.activatePremiumDirectly(userId);
  }
}
