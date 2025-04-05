import { Transform } from "class-transformer";
import { IsDefined, IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "src/services/validators/strongPassword.validator";

export class AccountCreationDTO {
    
    @IsString()
    @MinLength(8, {message: 'The name must contains at least 5 characters'})
    @IsNotEmpty({message: 'The name is required'})
    readonly name: string;

    @IsString()
    @IsNotEmpty({message: 'You must provide the user identifier'})
    @MinLength(5, {message: 'The user must contains at least 5 characters'})
    readonly user: string;

    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({message: 'The email field must not be empty'})
    readonly email: string;

    @IsNotEmpty({message: "The role is required"})
    @IsInt({message: "Invalid role information format"})
    @Transform(({ value }) => parseInt(value.toString()))
    roleId: number;

    @IsString()
    @IsStrongPassword({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' })
    @IsNotEmpty({message: 'The password is required'})
    password: string;
}

export class AccountUpdateDTO {
    
    @IsString()
    @MinLength(5, {message: 'The name must contains at least 5 characters'})
    @IsNotEmpty({message: 'The name is required'})
    readonly name: string;

    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({message: 'The email field must not be empty'})
    readonly email: string;
}

export class AccountCredentialsUpdateDTO {
    
    @IsString()
    @MinLength(5, {message: 'The user must contains at least 5 characters'})
    @IsNotEmpty({message: 'You must provide the user identifier'})
    readonly user: string;

    @IsNotEmpty({message: "The role is required"})
    @IsInt({message: "Invalid role information format"})
    @Transform(({ value }) => parseInt(value.toString()))
    roleId: number;

    @IsString()
    @IsStrongPassword({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' })
    prevPassword?: string;

    @IsString()
    @IsStrongPassword({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' })
    readonly password?: string;
}