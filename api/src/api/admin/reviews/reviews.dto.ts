import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Max, Min, MinLength } from "class-validator";

export class ReviewLinkCreationDTO {
    
    @IsString()
    @MinLength(5, {message: 'The name must contains at least 5 characters'})
    @IsNotEmpty({message: 'You must provide the name'})
    readonly name: string;

    @IsString()
    @MinLength(5, {message: 'The name of the place must contains at least 5 characters'})
    @IsNotEmpty({message: 'You must provide the place of the person'})
    readonly place: string;
}

export class ClientLinkCreationDTO {
    
    @IsNotEmpty({message: "The client is required"})
    @IsInt({message: "Invalid client information format"})
    @Transform(({ value }) => parseInt(value.toString()))
    clientId: number;
}

export class ReviewDTO {
    @IsNotEmpty({message: "The rate is required"})
    @IsInt({message: "Invalid rate information format"})
    @Min(1, {message: 'Rate must be bigger than 1'})
    @Max(5, {message: 'Rate must be less than 5'})
    @Transform(({ value }) => parseInt(value.toString()))
    rate: number;

    @IsString()
    @MinLength(5, {message: 'The comment must contains at least 5 characters'})
    @IsNotEmpty({message: 'You must provide a comment'})
    comment: string;
}