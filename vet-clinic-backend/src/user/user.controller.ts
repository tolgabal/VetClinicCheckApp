import { Controller, Get, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Body, Delete, Param, Patch } from "@nestjs/common";
import { CreateUserDto } from "./dtos/createuser-dto";
import { UpdateUserDto } from "./dtos/updateuser-dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "src/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @Post()
    @Roles(Role.Admin, Role.Veteriner)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @Roles(Role.Admin, Role.Veteriner)
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id' , ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id' , ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(id, updateUserDto);
    }
    
    @Delete(':id')
    remove(@Param ('id' , ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}