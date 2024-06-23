// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      address: '123 Main St',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      address: '456 Elm St',
    },
  });

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product A',
      description: 'Description for product A',
      price: 5.0,
      stock: 100,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product B',
      description: 'Description for product B',
      price: 10.0,
      stock: 50,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Product C',
      description: 'Description for product C',
      price: 20.0,
      stock: 150,
    },
  });
  const coupon1 = await prisma.coupon.create({
    data: {
      code: 'SAVE10',
      discount: 10,
    },
  });

  const coupon2 = await prisma.coupon.create({
    data: {
      code: 'SAVE20',
      discount: 20,
    },
  });

  console.log({ user1, user2, product1, product2, product3, coupon1, coupon2 });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
