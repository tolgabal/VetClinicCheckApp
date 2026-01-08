import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnimalTypeController } from "./animaltype.controller";
import { AnimalTypeService } from "./animaltype.service";
import { AnimalType } from "./animaltype.entity";
import { Animal } from "src/animal/animal.entity";


@Module ({

    imports: [
        TypeOrmModule.forFeature([AnimalType, Animal])
    ],

    controllers: [AnimalTypeController],

    providers: [AnimalTypeService]

})

export class AnimalTypeModule {}