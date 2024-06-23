import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty()
  @IsString()
  @IsEnum(['pending', 'accepted', 'cancelled', 'delivering', 'delivered'])
  status: string;
}
