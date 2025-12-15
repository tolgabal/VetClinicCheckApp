import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Animal } from "src/animal/animal.entity";
import { VaccineController } from "./vaccine.controller";
import { VaccineService } from "./vaccine.service";
import { Vaccine } from "./vaccine.entity";


@Module({

    imports: [TypeOrmModule.forFeature([Animal, Vaccine])],
    
    controllers: [VaccineController],

    providers: [VaccineService]
})
export class VaccineModule {}