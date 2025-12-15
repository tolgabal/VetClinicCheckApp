import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Parola en az 6 karakter içermelidir!' })
    password: string;

    @IsNotEmpty()
    @IsInt()
    userRoleId: number;

    @IsOptional()
    @IsArray()
    @IsInt( { each: true } )
    animalIds: number[];

}