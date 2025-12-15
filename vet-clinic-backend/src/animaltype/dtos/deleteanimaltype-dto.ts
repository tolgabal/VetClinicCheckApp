import { IsNotEmpty, IsNumber } from "class-validator";


export class DeleteAnimalTypeDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;
    
}