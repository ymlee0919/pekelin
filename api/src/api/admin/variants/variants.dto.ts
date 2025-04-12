import { IsBoolean, IsDefined, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { FeatureDTO } from "../products/products.dto";
import { BadRequestException } from "@nestjs/common";

export class VariantDTO {

    @IsString()
    @IsNotEmpty({message: "The product name is required"})
    @MinLength(3, { message : 'The product name must be longer than 3 characters'})
    name: string;

    @IsString()
    //@MinLength(10, {message: 'You must provide more than 10 characters for description', always: false})
    @IsOptional()
    description?: string;

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty({ message: 'BestSeller field is required' })
    @IsBoolean()
    isBestSeller: boolean;

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty({ message: 'IsNew field is required' })
    @IsBoolean()
    isNew: boolean;

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty({ message: 'IsVisible field is required' })
    @IsBoolean()
    visible: boolean;

    @IsNotEmpty({ message: 'Products features can not be empty' })
    //@ValidateNested({ each: true })
    //@MinLength(1, { message: 'The product must have at least one feature'})
    @Type(() => FeatureDTO)
    @Transform(({ value }) => {
        try {
            const parsedValue = typeof value === "string" ? JSON.parse(value) : value;
            return parsedValue.map((feature: any) => ({
                featureId: +feature.featureId,
                status: +feature.status,
                title: feature.title,
                content: feature.content,
            }));
        } catch (error) {
            throw new BadRequestException('Invalid features format');
        }
    })
    features: FeatureDTO[];
}