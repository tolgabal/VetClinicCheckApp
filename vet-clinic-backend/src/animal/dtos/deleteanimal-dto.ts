import { IsNumber } from "class-validator";


export class DeleteAnimalDto {

    @IsNumber()
    id: number;

}