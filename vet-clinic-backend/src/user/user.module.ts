import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Animal } from "src/animal/animal.entity";
import { UserRole } from "src/userrole/userrole.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({

    imports: [
        TypeOrmModule.forFeature([User, Animal, UserRole])
    ],

    controllers: [UserController],

    providers: [UserService],

})

export class UserModule { }