import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class ClientDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  place: string;

  @IsOptional()
  @IsString()
  phone?: string;
}