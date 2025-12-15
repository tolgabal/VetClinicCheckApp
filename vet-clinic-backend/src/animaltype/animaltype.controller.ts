import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { AnimalTypeService } from "./animaltype.service";
import { CreateAnimalTypeDto } from "./dtos/createanimaltype-dto";
import { UpdateAnimalTypeDto } from "./dtos/updateanimaltype-dto";


@Controller('animal-type')
export class AnimalTypeController {

    constructor(
        private readonly animalTypeService: AnimalTypeService
    ) {}

    @Post()
    create (@Body() createAnimalTypeDto: CreateAnimalTypeDto) {
        return this.animalTypeService.create(createAnimalTypeDto);
    }

    @Get()
    findAll() {
        return this.animalTypeService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.animalTypeService.findById(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAnimalTypeDto: UpdateAnimalTypeDto
    ) {
        return this.animalTypeService.update(id, updateAnimalTypeDto);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.animalTypeService.remove(id);
    }
}