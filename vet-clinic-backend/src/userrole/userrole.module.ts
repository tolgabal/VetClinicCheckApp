import { Module } from "@nestjs/common";
import { UserRoleController } from "./userrole.controller";
import { UserRoleService } from "./userrole.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRole } from "./userrole.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserRole])
    ],

    controllers: [UserRoleController],

    providers: [UserRoleService],
})
export class UserRoleModule {}