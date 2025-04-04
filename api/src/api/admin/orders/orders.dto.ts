import { IsNotEmpty, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message : 'The title must be longer than 5 characters'})
  title: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value.toString()))
  clientId: number;
}

export class UpdateOrderDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value.toString()))
  clientId?: number;
}

export class OrderStatusDTO {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class OrdersFilterDTO {
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid status type provided' })
  status?: OrderStatus;
}