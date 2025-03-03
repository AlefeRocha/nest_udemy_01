import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, minLength, MinLength } from "class-validator";

export class CreatePersonDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    readonly password: string;
}
