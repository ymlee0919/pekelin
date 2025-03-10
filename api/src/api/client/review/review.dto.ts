import { IsInt, IsNotEmpty, IsString, Max, Min, MinLength } from "class-validator";
import { Transform } from 'class-transformer';
//import xss from "xss";

var xss = require("xss");

export class ReviewDTO {
    
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    readonly rate: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @Transform(({ value }) => xss(value))
    readonly comment: string;
}