import { IsInt, IsNotEmpty } from "class-validator";


export class DeleteVaccineDto {
    
    @IsNotEmpty()
    @IsInt()
    id: number;
    
}