import { Body, Controller, Post, Get, ParseIntPipe, Param, Patch, Delete } from "@nestjs/common";
import { AnimalService } from "./animal.service";
import { CreateAnimalDto } from "./dtos/createanimal-dto";
import { UpdateAnimalDto } from "./dtos/updateanimaldto";


@Controller('animal')
export class AnimalController {

    constructor(
        private readonly animalService: AnimalService
    ) {}

    @Post()
    create(@Body() createAnimalDto: CreateAnimalDto) {
        return this.animalService.create(createAnimalDto);
    }

    @Get()
    findAll() {
        return this.animalService.findAll();
    }

    @Get(':id')
    findOne(@Param ('id' , ParseIntPipe) id: number) {
        return this.animalService.findOne(id);
    }

    @Patch(':id')
    update (
        @Param ('id' , ParseIntPipe) id: number,
        @Body() updateAnimalDto: UpdateAnimalDto
    ) {
        return this.animalService.update(id, updateAnimalDto);
    }

    @Delete(':id')
    remove(@Param ('id', ParseIntPipe) id:number) {
        return this.animalService.remove(id);
    }
}