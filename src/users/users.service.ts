import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: { orderItems: { include: { product: true } } },
    });
  }
}
