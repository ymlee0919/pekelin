import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  details: string;

  @IsArray()
  @ArrayNotEmpty()
  permissionIds: number[];
}

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    details?: string;
  
    @IsOptional()
    @IsArray()
    permissionIds?: number[];
  }
  