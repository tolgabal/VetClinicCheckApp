import { IsNotEmpty, IsString } from "class-validator";


export class CreateUserRoleDto {

    @IsNotEmpty()
    @IsString()
    name: string;
    
}