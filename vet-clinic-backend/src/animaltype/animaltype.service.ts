import { ConflictException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AnimalType } from "./animaltype.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAnimalTypeDto } from "./dtos/createanimaltype-dto";
import { UpdateAnimalTypeDto } from "./dtos/updateanimaltype-dto";


@Injectable()
export class AnimalTypeService {
    
    constructor(
        @InjectRepository(AnimalType)
        private readonly animalTypeRepository: Repository<AnimalType>
    ) {}

    async create (createAnimalTypeDto: CreateAnimalTypeDto): Promise<AnimalType> {

        const newAnimalType = this.animalTypeRepository.create({
            ...createAnimalTypeDto,
        });

        try {
            return await this.animalTypeRepository.save(newAnimalType);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new ConflictException('Kısıtlama hatası!')
            }
            throw error;
        }
    }

    async update (id: number, updateAnimalTypeDto: UpdateAnimalTypeDto): Promise<AnimalType> {

        const animalType = await this.animalTypeRepository.preload({
            id: id,
            ...updateAnimalTypeDto
        })

        if (!animalType) {
            throw new ConflictException('Hayvan bulunamadı!');
        }

        try {
            return await this.animalTypeRepository.save(animalType);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new Error('Kısıtlama hatası. Lütfen referans verilen hayvan tipi ve kullanıcıların var olduğundan emin olun.');
            }
            throw error;
        }
    }

    findAll(): Promise<AnimalType[]> {
        return this.animalTypeRepository.find();
    }

    async findById(id: number): Promise <AnimalType> {

        const animalType = await this.animalTypeRepository.findOne({
            where: {id : id},
        })
        if(!animalType) {
            throw new ConflictException('Aradığınız hayvan tipi bulunamadı!')
        }
        return animalType;
    }

    async remove(id: number): Promise<void> {
        const res = await this.animalTypeRepository.delete(id);
        if(res.affected === 0) {
            throw new ConflictException('Hayvan tipi bulunamadığı için silme işlemi gerçekleştirilemedi!')
        }
    }
} 