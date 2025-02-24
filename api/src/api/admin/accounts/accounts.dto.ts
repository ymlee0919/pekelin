import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AccountCreationDTO {
    
    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'You must provide the name'})
    @MinLength(8, {message: 'The name must contains at least 8 characters'})
    readonly name: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'You must provide the user identifier'})
    @MinLength(8, {message: 'The user must contains at least 8 characters'})
    readonly user: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'You must provide an email'})
    @IsEmail()
    readonly email: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'Password can not be empty'})
    @MinLength(8, {message: 'The poasword must contains at least 8 characters'})
    readonly password: string;
}

export class AccountUpdateDTO {
    
    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'You must provide the name'})
    @MinLength(8, {message: 'The name must contains at least 8 characters'})
    readonly name: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'You must provide an email'})
    @IsEmail()
    readonly email: string;
}

export class AccountCredentialsUpdateDTO {
    
    @IsDefined()
    @IsString()
    @IsNotEmpty({message: 'You must provide the user identifier'})
    @MinLength(8, {message: 'The user must contains at least 8 characters'})
    readonly user: string;

    @IsString()
    @MinLength(8, {message: 'The password must contains at least 8 characters'})
    readonly password?: string;
}