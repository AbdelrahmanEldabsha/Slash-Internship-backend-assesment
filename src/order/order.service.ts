import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // Method to create a new order
  async createOrder(userId: number, res: any) {
    // Find the user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    // Throw an error if the cart does not exist
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Find all items in the user's cart
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.cartId },
      include: { product: true },
    });

    // Throw an error if the cart is empty
    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Create a new order with initial status and details
    const order = await this.prisma.order.create({
      data: {
        status: 'Pending',
        userId,
        discount: 0,
        totalPrice: cart.totalPrice,
      },
    });

    // Map cart items to order items
    const orderItems = cartItems.map((item) => {
      return {
        orderId: order.orderId,
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    // Create the order items in the database
    await this.prisma.orderItem.createMany({
      data: orderItems,
    });

    // Clear the user's cart items
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.cartId,
      },
    });

    // Delete the user's cart
    await this.prisma.cart.delete({
      where: {
        cartId: cart.cartId,
      },
    });

    // Update the stock for each product in the order
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      await this.prisma.product.update({
        where: { productId: item.productId },
        data: { stock: item.product.stock - item.quantity },
      });
    }

    // Calculate the final price after applying any discount
    let price = order.totalPrice;
    if (price - order.discount < 0) {
      price = 0;
    } else {
      price = price - order.discount;
    }

    // Update the order with the final price
    const orderResponse = await this.prisma.order.update({
      where: { orderId: order.orderId },
      data: { totalPrice: price },
      include: { orderItems: true },
    });

    // Return the response
    return res.status(200).json({ message: 'done', order: orderResponse });
  }

  // Method to get an order by its ID
  async getOrderById(orderId: number, res: any) {
    // Find the order with its items and product details
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { orderItems: { include: { product: true } } },
    });

    // Throw an error if the order does not exist
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Return the response
    return res.status(200).json({ message: 'done', order });
  }

  // Method to update the status of an order
  async updateOrderStatus(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
    res: any,
  ) {
    const { status } = updateOrderDto;

    // Update the order status
    const order = await this.prisma.order.update({
      where: { orderId },
      data: { status },
      include: { orderItems: { include: { product: true } } },
    });

    // Throw an error if the order does not exist
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Return the response
    return res.status(200).json({ message: 'done', order });
  }

  // Method to apply a coupon to an order
  async applyCoupon(body: ApplyCouponDto, res: any) {
    const { orderId, code } = body;

    // Find the order
    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    // Throw an error if the order does not exist
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Find the coupon by its code
    const coupon = await this.prisma.coupon.findFirst({
      where: { code },
    });

    // Throw an error if the coupon does not exist
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    // Update the order with the discount from the coupon
    const updatedOrder = await this.prisma.order.update({
      where: { orderId },
      data: { discount: coupon.discount },
    });

    // Return the response
    return res.status(200).json({ message: 'Discount added', updatedOrder });
  }

  // Method to get all user orders history
//   async getUserOrders(userId: number, res: any) {
//     // Find all orders for the user
//     const orders = await this.prisma.order.findMany({
//       where: { userId },
//       include: { orderItems: { include: { product: true } } },
//     });

//     // Return the response
//     return res.status(200).json({ message: 'done', orders });
//   }
}
