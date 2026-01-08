import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Vaccine } from '../vaccine/vaccine.entity';
import { User } from '../user/user.entity';
import { AnimalType } from '../animaltype/animaltype.entity';

@Entity()
export class Animal {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    age: number;
    
    @ManyToOne(() => AnimalType, (animalType) => animalType.animals)
    animalType: AnimalType;

    @ManyToMany(() => User, (user) => user.animals)
    @JoinTable()
    users: User[];

    @OneToMany(() => Vaccine, (vaccine) => vaccine.animal)
    vaccines: Vaccine[];
}