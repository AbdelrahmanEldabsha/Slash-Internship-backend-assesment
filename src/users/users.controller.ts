import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/orders')
  getUserOrders(@Param('userId') userId: string) {
    return this.usersService.getUserOrders(+userId);
  }
}
