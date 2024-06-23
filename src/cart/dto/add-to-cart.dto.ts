import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToCartDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
