import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CategoryDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    readonly category: string;
}