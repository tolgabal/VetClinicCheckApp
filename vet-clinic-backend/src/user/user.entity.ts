import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../userrole/userrole.entity";
import { Animal } from "../animal/animal.entity";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => UserRole, (userRole) => userRole.users)
    userRole: UserRole;

    // animal entity'sini hazırladıktan sonra buraya OneToMany ilişkisi ekleyeceğim
    @ManyToMany(() => Animal, (animal) => animal.users)
    animals: Animal[];
    
}