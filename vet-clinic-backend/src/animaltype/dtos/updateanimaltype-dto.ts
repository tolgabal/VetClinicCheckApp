import { PartialType } from "@nestjs/mapped-types";
import { CreateAnimalTypeDto } from "./createanimaltype-dto";

export class UpdateAnimalTypeDto extends PartialType (CreateAnimalTypeDto) {}