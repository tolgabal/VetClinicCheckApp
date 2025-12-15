import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "./userrole.entity";
import { Repository } from "typeorm";
import { CreateUserRoleDto } from "./dtos/createuserrole-dto";
import { UpdateUserRoleDto } from "./dtos/updateuserrole-dto";

@Injectable()
export class UserRoleService {

    constructor (
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>
    ) {}

    async create (createUserRoleDto : CreateUserRoleDto): Promise<UserRole> {

        const newUserRole = this.userRoleRepository.create({
            ...createUserRoleDto
        });

        try {
            return await this.userRoleRepository.save(newUserRole);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT')
            {throw new ConflictException('Bu isimde bir rol zaten mevcut! Rol isimleri tekrarlanamaz.');}
            throw error;
        }
    }

    async update (
        id: number, updateUserRoleDto: UpdateUserRoleDto
    ): Promise<UserRole> {

        const userRole = await this.userRoleRepository.preload({
            id:id,
            ...updateUserRoleDto
        })

        if(!userRole) {
            throw new ConflictException('Rol Bulunamadı!')
        }

        try {
            return await this.userRoleRepository.save(userRole);
        } catch (error) {
            throw error;
        }
    }

    findAll(): Promise<UserRole[]> {
        return this.userRoleRepository.find({});
    }

    async findById (id: number): Promise<UserRole> {

        const userRole = await this.userRoleRepository.findOne({
            where : {id}
        });

        if (!userRole) {
            throw new ConflictException('Rol bulunamadı!');
        }

        return userRole;
    }

    async remove (id: number): Promise<void> {
        
        const result = await this.userRoleRepository.delete(id);

        if (result.affected === 0) {
            throw new ConflictException('Rol Bulunamadı!');
        }
        

    }
}