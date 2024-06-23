import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  productId: number;
}
