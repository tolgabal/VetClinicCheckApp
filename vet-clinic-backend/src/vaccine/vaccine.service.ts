import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vaccine } from "./vaccine.entity";
import { Repository } from "typeorm";
import { CreateVaccineDto } from "./dtos/createvaccine-dto";
import { UpdateVaccineDto } from "./dtos/updatevaccine-dto";


@Injectable()
export class VaccineService {

    constructor(
        @InjectRepository(Vaccine)
        private readonly vaccineRepository: Repository <Vaccine>,
    ) { }

    async create (createVaccineDto: CreateVaccineDto): Promise<Vaccine> {

        const animal = {id: createVaccineDto.animalId};

        const newVaccine = this.vaccineRepository.create({
            ...createVaccineDto,
            animal: animal
        });

        try {
            return await this.vaccineRepository.save(newVaccine);
        } catch (error) {
            if(error.code === 'SQLITE-CONSTRAINT') {
                throw new ConflictException('Hayvan Bulunamadı!');
            }
            throw error;
        }

    }

    async update (
        id: number,
        updateVaccineDto: UpdateVaccineDto
    ): Promise<Vaccine> {

        const animal = {id: updateVaccineDto.animalId};

        const vaccine = await this.vaccineRepository.preload({
            id: id,
            ...updateVaccineDto,
            animal: animal
        });

        if(!vaccine) {
            throw new ConflictException('Aşı Bulunamadı!')
        }

        try {
            return await this.vaccineRepository.save(vaccine);
        } catch (error) {
            throw error;
        }
    }

    findAll(): Promise<Vaccine[]> {
        return this.vaccineRepository.find({
            relations: ['animal'],
        });
    }

    async findById (id: number): Promise<Vaccine> {

        const vaccine = await this.vaccineRepository.findOne({
            where: {id},
            relations: ['animal']
        })

        if (!vaccine) {
            throw new ConflictException ('İlgili Aşı Bulunamadı!');
        }

        return vaccine;
    }

    async delete (id: number): Promise<void> {
        
        const result = await this.vaccineRepository.delete(id);

        if (result.affected === 0) {
            throw new ConflictException('Aşı bulunamadı!');
        }

    }
}