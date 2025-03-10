import { IsDefined, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CategoryDTO {
    
    @IsString()
    @MinLength(3, {message: "The category name must be longer than 5 characters"})
    @IsNotEmpty({message: "The name of the category is required"})
    readonly category: string;

    @IsString()
    @MinLength(10, {message: "The category description must be longer than 10 characters"})
    @IsNotEmpty({message: "The category description is required"})
    readonly description: string;
}