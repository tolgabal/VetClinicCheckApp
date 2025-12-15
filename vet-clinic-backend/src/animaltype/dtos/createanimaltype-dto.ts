import { IsNotEmpty, IsString } from "class-validator";


export class CreateAnimalTypeDto {

    @IsNotEmpty()
    @IsString()
    name: string;

}