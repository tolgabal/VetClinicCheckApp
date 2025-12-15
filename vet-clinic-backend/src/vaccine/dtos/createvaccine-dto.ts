import { IsDateString, IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateVaccineDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDateString()
    lastVaccinationDate: Date;

    @IsNotEmpty()
    @IsDateString()
    nextVaccinationDate: Date;

    @IsNotEmpty()
    @IsInt()
    animalId: number;
}