import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemoveFromCartDto } from './dto/remove-cart-dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCartDto, res: any): Promise<any> {
    const { userId, productId, quantity } = addToCartDto;
    // Find the user's cart, including cart items
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
    // If cart does not exist, create a new one
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { cartItems: true },
      });
    }
    // Check if the product is already in the cart
    const existingCartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );

    if (existingCartItem) {
      //check if quantity is less than the stock
      const product = await this.prisma.product.findUnique({
        where: { productId },
      });
      if (
        quantity + existingCartItem.quantity > product.stock ||
        quantity > product.stock
      ) {
        throw new BadRequestException('Quantity exceeds stock');
      }
      // If product is already in cart, update the quantity
      await this.prisma.cartItem.update({
        where: { cartItemId: existingCartItem.cartItemId },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // If product is not in cart, create a new cart item
      await this.prisma.cartItem.create({
        data: { cartId: cart.cartId, productId, quantity },
      });
    }

    // Recalculate the total price of the cart
    const updatedCartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.cartId },
      include: { product: true },
    });
    let totalPrice = 0;

    for (let i = 0; i < updatedCartItems.length; i++) {
      const item = updatedCartItems[i];
      totalPrice += item.product.price * item.quantity;
    }

    // Update the total price of the cart
    await this.prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { totalPrice },
    });

    const updatedCart = await this.prisma.cart.findUnique({
      where: { cartId: cart.cartId },
      include: { cartItems: true },
    });
    return res.status(201).json(updatedCart);
  }

  async viewCart(userId: number, res: any) {
    // Find the user's cart, including cart items and product details
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return res.status(200).json({ message: 'done', cart });
  }
  async updateCart(updateCartDto: UpdateCartDto, res: any) {
    const { userId, productId, quantity } = updateCartDto;

    // Find the user's cart, including cart items
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }
    //check if quantity is less than the stock
    const product = await this.prisma.product.findUnique({
      where: { productId },
    });
    if (quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds stock');
    }
    // Update the quantity of the cart item
    await this.prisma.cartItem.update({
      where: { cartItemId: cartItem.cartItemId },
      data: { quantity },
    });

    // Recalculate the total price of the cart
    const updatedCartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.cartId },
      include: { product: true },
    });

    let totalPrice = 0;
    for (let i = 0; i < updatedCartItems.length; i++) {
      const item = updatedCartItems[i];
      totalPrice += item.product.price * item.quantity;
    }

    // Update the total price of the cart
    await this.prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { totalPrice },
    });

    const updatedCart = await this.prisma.cart.findUnique({
      where: { cartId: cart.cartId },
      include: { cartItems: true },
    });
    return res.status(200).json({ message: 'done', updatedCart });
  }
  async removeFromCart(removeFromCartDto: RemoveFromCartDto, res: any) {
    const { userId, productId } = removeFromCartDto;
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }
    await this.prisma.cartItem.delete({
      where: { cartItemId: cartItem.cartItemId },
    });
    // Recalculate the total price of the cart
    const updatedCartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.cartId },
      include: { product: true },
    });
    let totalPrice = 0;
    for (let i = 0; i < updatedCartItems.length; i++) {
      const item = updatedCartItems[i];
      totalPrice += item.product.price * item.quantity;
    }
    // Update the total price of the cart
    await this.prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { totalPrice },
    });
    const updatedCart = await this.prisma.cart.findUnique({
      where: { cartId: cart.cartId },
      include: { cartItems: true },
    });
    return res
      .status(200)
      .json({ message: 'Itemdeleted successfully', updatedCart });
  }
}
