import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { UserRoleService } from "./userrole.service";
import { CreateUserRoleDto } from "./dtos/createuserrole-dto";
import { UpdateUserRoleDto } from "./dtos/updateuserrole-dto";


@Controller('user-role')
export class UserRoleController {

    constructor (
        private readonly userRoleService: UserRoleService
    ) {}

    @Post()
    create (@Body() createUserRoleDto: CreateUserRoleDto) {
        return this.userRoleService.create(createUserRoleDto);
    }

    @Get()
    findAll() {
        return this.userRoleService.findAll();
    }

    @Get(':id')
    findById(@Param ('id', ParseIntPipe) id: number) {
        return this.userRoleService.findById(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserRoleDto: UpdateUserRoleDto
    ) {
        return this.userRoleService.update(id, updateUserRoleDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userRoleService.remove(id);
    }
}