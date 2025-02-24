import { IsBoolean, IsDefined, IsEnum, IsInt, IsNotEmpty, IsString, MinLength, ValidateNested } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { FeatureDTO } from "../products/products.dto";

export class VariantDTO {
    
    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value.toString()))
    productId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {message: 'The name of a product must be at least 3 characters lenght'})
    name: string;

    @IsString()
    @MinLength(10, {message: 'You must provide more than 10 characters for description'})
    description?: string;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    isBestSeller: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    isNew: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    visible: boolean;

    @IsDefined()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @MinLength(1, { message: 'The product must have at least one feature'})
    @Type(() => FeatureDTO)
    features: FeatureDTO[];
}