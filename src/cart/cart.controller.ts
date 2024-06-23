import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';

import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Response } from 'express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CartResponse } from './entities/cart.entity';
import { RemoveFromCartDto } from './dto/remove-cart-dto';

@Controller('cart')
@ApiTags('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiCreatedResponse({ type: CartResponse })
  addToCart(@Body() addToCartDto: AddToCartDto, @Res() res: Response) {
    return this.cartService.addToCart(addToCartDto, res);
  }
  @Get(':userId')
  @ApiCreatedResponse({ type: CartResponse })
  viewCart(@Param('userId') userId: string, @Res() res: Response) {
    return this.cartService.viewCart(+userId, res);
  }
  @Patch('update')
  @ApiCreatedResponse({ type: CartResponse })
  updateCart(@Body() updateCartDto: UpdateCartDto, @Res() res: Response) {
    return this.cartService.updateCart(updateCartDto, res);
  }
  @Patch('remove')
  @ApiCreatedResponse({ type: CartResponse })
  removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto, @Res() res: Response) {
    return this.cartService.removeFromCart(removeFromCartDto, res);
  }
}
