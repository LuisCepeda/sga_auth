import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator"

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