import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Animal } from "./animal.entity";
import { User } from "src/user/user.entity";
import { AnimalType } from "src/animaltype/animaltype.entity";
import { Vaccine } from "src/vaccine/vaccine.entity";
import { AnimalController } from "./animal.controller";
import { AnimalService } from "./animal.service";


@Module({

    imports : [
        TypeOrmModule.forFeature ([Animal, User, AnimalType, Vaccine])
    ],

    controllers : [AnimalController],

    providers : [AnimalService],

})

export class AnimalModule {}