import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/createuser-dto";
import { UpdateUserDto } from "./dtos/updateuser-dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create (createUserDto: CreateUserDto): Promise<User> {

        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const userRole = {id: createUserDto.userRoleId};

        const animals = createUserDto.animalIds
            ? createUserDto.animalIds.map((id) => ({ id }))
            : [];

        const newUser = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            userRole : userRole,
            animals : animals,
        });

        try {
            return await this.userRepository.save(newUser);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new ConflictException('Email ya da Kullanıcı adı zaten mevcut!');
            }
            throw error;
        }
    }

    async update (id: number, updateUserDto: UpdateUserDto): Promise<User> {

        const userRole = updateUserDto.userRoleId
            ? {id: updateUserDto.userRoleId}
            : undefined;
        
        const animals = updateUserDto.animalIds
            ? updateUserDto.animalIds.map((id) => ({ id }))
            : undefined;
        
        const user = await this.userRepository.preload({
            id: id,
            ...updateUserDto,
            userRole : userRole,
            animals : animals,
        });

        if (!user) {
            throw new ConflictException('Kullanıcı bulunamadı!');
        }

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new ConflictException('Bu bilgilere sahip başka bir kullanıcı zaten mevcut!');
            }
            throw error;
        }   

    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['userRole', 'animals'],
        });
    }

    async findOne(id: number) : Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userRole', 'animals'],
        })
        if (!user) {
            throw new ConflictException('Kullanıcı bulunamadı!');
        }
        return user;
    }

    async remove(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new ConflictException('Kullanıcı bulunamadı!');
        }
    }

    async findByEmail (identifier: string): Promise<User | null> {

        return this.userRepository.findOne({
            where: {email: identifier},
            relations: ['userRole', 'animals']
        })

    }

    async findByUsername (identifier: string): Promise<User | null> {

        return this.userRepository.findOne({
            where: {username: identifier},
            relations: ['userRole' , 'animals']
        })

    }
}