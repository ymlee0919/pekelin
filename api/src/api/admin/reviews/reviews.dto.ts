import { IsDefined, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ReviewLinkCreationDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'You must provide the name'})
    @MinLength(5, {message: 'The name must contains at least 5 characters'})
    readonly name: string;
}
