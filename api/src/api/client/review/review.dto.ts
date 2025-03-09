import { IsDefined, IsInt, IsNotEmpty, IsString, Max, Min, MinLength } from "class-validator";

export class ReviewDTO {
    @IsDefined()
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    readonly rate: number;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    readonly comment: string;
}