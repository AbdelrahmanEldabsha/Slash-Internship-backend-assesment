import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Controller('orders')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':userId')
  createOrder(@Param('userId') userId: string, @Res() res: any) {
    return this.orderService.createOrder(+userId, res);
  }

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string, @Res() res: any) {
    return this.orderService.getOrderById(+orderId, res);
  }

  @Patch(':orderId')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: any,
  ) {
    return this.orderService.updateOrderStatus(+orderId, updateOrderDto, res);
  }

  @Put('apply-coupon')
  applyCoupon(@Body() body: ApplyCouponDto, @Res() res: any) {
    console.log('====================================');
    console.log(body);
    console.log('====================================');
    return this.orderService.applyCoupon(body, res);
  }


}
