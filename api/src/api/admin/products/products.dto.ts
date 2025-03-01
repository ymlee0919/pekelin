import { IsBoolean, IsDefined, IsEnum, IsInt, IsNotEmpty, IsString, MinLength, ValidateNested } from "class-validator";
import { FeatureStatus } from "./products.types";
import { Transform, Type } from 'class-transformer';

export class FeatureDTO {

    @IsDefined({message:'Unable to take a feature'})
    @IsNotEmpty()
    @IsInt()
    featureId: number;

    @IsDefined({message:'Unable to take a feature'})
    @IsNotEmpty()
    @IsEnum(FeatureStatus)
	status: FeatureStatus;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message : 'The title of a feature must be at least 3 characters lenght'})
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message : 'The feature of a product must be at least 3 characters lenght'})
    content: string;
}

export class ProductDTO {
    
    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value.toString()))
    categoryId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {message: 'The name of a product must be at least 3 characters lenght'})
    name: string;

    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value.toString()))
    price: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    gender: string;

    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value.toString()))
    basePrice: number;

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

export class ProductSetDTO extends ProductDTO {

    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value.toString()))
    product1: number;

    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value.toString()))
    product2: number;
}