import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '@prisma/client';
import { ProductResponse } from './productId.entity';

export class CartItemResponse implements CartItem {
  @ApiProperty()
  cartItemId: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  cartId: number;
  @ApiProperty()
  productId: number;
}
