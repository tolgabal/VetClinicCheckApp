import { IsInt, IsNotEmpty } from "class-validator";


export class DeleteUserDto {

    @IsNotEmpty()
    @IsInt()
    id: number;
    
}