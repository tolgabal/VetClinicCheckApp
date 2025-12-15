import { ConflictException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Animal } from "./animal.entity";
import { CreateAnimalDto } from "./dtos/createanimal-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateAnimalDto } from "./dtos/updateanimaldto";


@Injectable()
export class AnimalService {

    constructor(
        @InjectRepository(Animal)
        private readonly animalRepository: Repository<Animal>
    ) {}

    async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {

        const animalType = {id: createAnimalDto.animalTypeId};

        const users = createAnimalDto.userIds
            ? createAnimalDto.userIds.map((id) => ({ id }))
            : [];
        
        const newAnimal = this.animalRepository.create({
            ...createAnimalDto,
            animalType: animalType,
            users: users
        });
        
        try {
            return await this.animalRepository.save(newAnimal);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new Error('Foreign key constraint failed. Please ensure that the referenced AnimalType and Users exist.');
            }
            throw error;
        }
    }

    async update (id: number, updateAnimalDto: UpdateAnimalDto) : Promise <Animal> {

        const animalType = updateAnimalDto.animalTypeId
            ? {id: updateAnimalDto.animalTypeId}
            : undefined;

        const users = updateAnimalDto.userIds
            ? updateAnimalDto.userIds.map((id) => ({id}))
            : undefined;
        
        const animal = await this.animalRepository.preload({
            id: id,
            ...updateAnimalDto,
            animalType: animalType,
            users: users
        })

        if (!animal) {
            throw new ConflictException('Hayvan bulunamadı!');
        }

        try {
            return await this.animalRepository.save(animal);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new Error('Kısıtlama hatası. Lütfen referans verilen hayvan tipi ve kullanıcıların var olduğundan emin olun.');
            }
            throw error;
        }
    }

    findAll(): Promise<Animal[]> {
        return this.animalRepository.find({
            relations: ['animalType', 'users', 'vaccines']
        })
    }

    async findOne(id: number): Promise<Animal> {
        const animal = await this.animalRepository.findOne({
            where: {id: id},
            relations: ['animalType', 'users', 'vaccines']
        })
        if (!animal) {
            throw new ConflictException('Hayvan bulunamadı!');
        }
        return animal;
    }

    async remove (id: number): Promise<void> {
        const result = await this.animalRepository.delete(id);
        if (result.affected === 0) {
            throw new ConflictException('Hayvan bulunamadı!');
        }
    }
    
}