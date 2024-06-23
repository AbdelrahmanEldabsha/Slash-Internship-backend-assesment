import { ApiProperty } from '@nestjs/swagger';
import { Cart, CartItem } from '@prisma/client';
import { CartItemResponse } from './cartItem.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';

export class CartResponse implements Cart {
  @ApiProperty()
  cartId: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  totalPrice: number;
  @ApiProperty()
  cartItems: AddToCartDto[];
}
