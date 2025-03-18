import { IsBoolean, IsDefined, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, MinLength, ValidateNested } from "class-validator";
import { FeatureStatus } from "./products.types";
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from "@nestjs/common";

export class FeatureDTO {

    @IsNotEmpty({message: "Invalid empty field"})
    @IsInt({message: "Invalid feature"})
    featureId: number;

    @IsNotEmpty({message: "Invalid empty field"})
    @IsEnum(FeatureStatus)
	status: FeatureStatus;

    @IsString()
    @IsNotEmpty({message: "The feature title is required"})
    @MinLength(3, { message : 'The feature title must be longer than 3 characters'})
    title: string;

    @IsString()
    @IsNotEmpty({message: "The feature description is required"})
    @MinLength(3, { message : 'The feature description must be longer than 3 characters'})
    content: string;
}

export class ProductDTO {
    
    @IsNotEmpty({message: "The category is required"})
    @IsInt({message: "Invalid category information format"})
    @Transform(({ value }) => parseInt(value.toString()))
    categoryId: number;

    @IsString()
    @IsNotEmpty({message: "The product name is required"})
    @MinLength(3, { message : 'The product name must be longer than 3 characters'})
    name: string;

    
    @Transform(({ value }) => parseInt(value.toString()))
    @IsInt({message: "The product price must be an integer number"})
    @IsNotEmpty({message: "The product price is required"})
    price: number;

    @Transform(({ value }) => parseInt(value.toString()))
    @IsInt({message: "The base price must be an integer number"})
    @IsNotEmpty({message: "The base price is required"})
    basePrice: number;

    @IsString()
    @Length(1,1,{ message: "The product gender must be one character (M)ale or (F)emale"})
    @IsNotEmpty({message: "The product gender can not be empty"})
    gender: string;

    @IsString()
    @IsOptional()
    @MinLength(10, {message: 'You must provide more than 10 characters for description'})
    description?: string;

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty({message: "BestSeller field is required"})
    @IsBoolean()
    isBestSeller: boolean;

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty({message: "IsNew field is required"})
    @IsBoolean()
    isNew: boolean;

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty({message: "IsVisible field is required"})
    @IsBoolean()
    visible: boolean;

    @IsNotEmpty({message: "Products features can not be empty"})
    @ValidateNested({ each: true })
    //@MinLength(1, { message: 'The product must have at least one feature'})
    @Type(() => FeatureDTO)
    @Transform(({value}) => {
        try {
            return JSON.parse(value);
        }catch(error) {
            throw new BadRequestException('Invalid features format');
        }
    })
    features: FeatureDTO[];
}

export class ProductSetDTO extends ProductDTO {

    @IsNotEmpty({message: "First product can not be empty"})
    @IsInt({message: "Invalid first product"})
    @Transform(({ value }) => parseInt(value.toString()))
    product1: number;

    @IsNotEmpty({message: "Second product can not be empty"})
    @IsInt({message: "Invalid second product"})
    @Transform(({ value }) => parseInt(value.toString()))
    product2: number;
}