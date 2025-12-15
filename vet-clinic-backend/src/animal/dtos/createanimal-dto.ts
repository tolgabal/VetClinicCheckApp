import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAnimalDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    age: number;

    @IsNotEmpty()
    @IsInt()
    animalTypeId: number;

    @IsInt({ each: true })
    userIds: number[];
}