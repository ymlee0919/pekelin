import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AccountCreationDTO {
    
    @IsString()
    @IsNotEmpty({message: 'You must provide the name'})
    @MinLength(8, {message: 'The name must contains at least 8 characters'})
    readonly name: string;

    @IsString()
    @IsNotEmpty({message: 'You must provide the user identifier'})
    @MinLength(8, {message: 'The user must contains at least 8 characters'})
    readonly user: string;

    @IsString()
    @IsNotEmpty({message: 'You must provide an email'})
    @IsEmail()
    readonly email: string;

    @IsString()
    @IsNotEmpty({message: 'Password can not be empty'})
    @MinLength(8, {message: 'The poasword must contains at least 8 characters'})
    readonly password: string;
}

export class AccountUpdateDTO {
    
    @IsString()
    @IsNotEmpty({message: 'You must provide the name'})
    @MinLength(8, {message: 'The name must contains at least 8 characters'})
    readonly name: string;

    @IsString()
    @IsNotEmpty({message: 'You must provide an email'})
    @IsEmail()
    readonly email: string;
}

export class AccountCredentialsUpdateDTO {
    
    @IsString()
    @IsNotEmpty({message: 'You must provide the user identifier'})
    @MinLength(8, {message: 'The user must contains at least 8 characters'})
    readonly user: string;

    @IsString()
    @MinLength(8, {message: 'The poasword must contains at least 8 characters'})
    readonly password?: string;
}