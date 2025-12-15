import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { VaccineService } from "./vaccine.service";
import { CreateVaccineDto } from "./dtos/createvaccine-dto";
import { UpdateVaccineDto } from "./dtos/updatevaccine-dto";


@Controller('vaccine')
export class VaccineController {

    constructor (
        private readonly vaccineService: VaccineService
    ) { }

    @Post()
    create(@Body() createVaccineDto: CreateVaccineDto) {
        return this.vaccineService.create(createVaccineDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVaccineDto: UpdateVaccineDto
    ) {
        return this.vaccineService.update(id, updateVaccineDto);
    }

    @Get()
    findAll() {
        return this.vaccineService.findAll();
    }

    @Get(':id')
    findById (@Param('id', ParseIntPipe) id: number) {
        return this.vaccineService.findById(id);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.vaccineService.delete(id);
    }
}