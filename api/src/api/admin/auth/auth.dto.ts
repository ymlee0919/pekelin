import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CredentialsDTO {
    
    @IsString()
    @IsNotEmpty({message: 'You must provide the user identifier'})
    readonly user: string;

    @IsString()
    @IsNotEmpty({message: 'Password can not be empty'})
    readonly password: string;

    @Transform(({ value }) => typeof value == "boolean" ? value : value === 'true')
    @IsBoolean()
    readonly remember: boolean;
}