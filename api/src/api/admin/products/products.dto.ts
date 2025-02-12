import { IsBoolean, IsInt, IsNotEmpty, IsString, MinLength, ValidateNested } from "class-validator";

class FeatureDTO {
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
    
    @IsNotEmpty()
    @IsInt()
    categoryId: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(3, {message: 'The name of a product must be at least 3 characters lenght'})
    name: string;

    @IsNotEmpty()
    @IsInt()
    price: number;

    @IsString()
    @MinLength(10, {message: 'You must provide more than 10 characters for description'})
    description?: string;

    @IsNotEmpty()
    @IsBoolean()
    bestSeller: boolean;

    @IsNotEmpty()
    @IsBoolean()
    new: boolean;

    @IsNotEmpty()
    @IsBoolean()
    visible: boolean;

    @IsNotEmpty()
    @ValidateNested()
    @MinLength(1, { message: 'The product must have at least one feature'})
    features: FeatureDTO[];
}