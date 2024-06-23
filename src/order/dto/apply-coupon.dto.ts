import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty()
  @IsNumber()
  orderId: number;
  @ApiProperty()
  @IsString()
  code: string;
}
