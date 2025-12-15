import { IsInt, IsNotEmpty } from "class-validator";


export class DeleteUserRoleDto {

    @IsNotEmpty()
    @IsInt()
    id: number;
    
}