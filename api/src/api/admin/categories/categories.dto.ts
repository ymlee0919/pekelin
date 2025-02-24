import { IsDefined, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CategoryDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    readonly category: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    readonly description: string;
}