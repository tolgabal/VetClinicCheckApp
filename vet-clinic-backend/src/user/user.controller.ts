import { Controller, Get, ParseIntPipe, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Body, Delete, Param, Patch } from "@nestjs/common";
import { CreateUserDto } from "./dtos/createuser-dto";
import { UpdateUserDto } from "./dtos/updateuser-dto";


@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
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