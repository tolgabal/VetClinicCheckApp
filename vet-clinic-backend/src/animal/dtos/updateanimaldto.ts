import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimalDto } from './createanimal-dto';

export class UpdateAnimalDto extends PartialType (CreateAnimalDto) {}