import { IsNotEmpty, IsString, IsEmail, MinLength, IsInt } from "class-validator"

export class AuthPayloadDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string
}

export class RegisterDTO {
    @IsNotEmpty()
    @IsString()
    firstname: string

    @IsNotEmpty()
    @IsString()
    lastname: string

    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    confirmPassword: string

    @IsNotEmpty()
    @IsInt()
    userSettingsId: number

    @IsNotEmpty()
    @IsInt()
    userRolSettingsId: number
}






