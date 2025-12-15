import { PartialType } from "@nestjs/mapped-types";
import { CreateVaccineDto } from "./createvaccine-dto";


export class UpdateVaccineDto extends PartialType(CreateVaccineDto) {}