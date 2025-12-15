import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnimalTypeController } from "./animaltype.controller";
import { AnimalTypeService } from "./animaltype.service";
import { AnimalType } from "./animaltype.entity";


@Module ({

    imports: [
        TypeOrmModule.forFeature([AnimalType])
    ],

    controllers: [AnimalTypeController],

    providers: [AnimalTypeService]

})

export class AnimalTypeModule {}