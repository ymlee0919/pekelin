import { IsNotEmpty, IsString, MinLength } from "class-validator";

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
