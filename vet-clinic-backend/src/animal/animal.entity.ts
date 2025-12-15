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
    
    // animaltype entity'sini hazırladıktan sonra buraya ManyToOne ilişkisi ekleyeceğim
    @ManyToOne(() => AnimalType, (animalType) => animalType.animals)
    animalType: AnimalType;

    // user entity'sini hazırladıktan sonra buraya ManyToMany ilişkisi ekleyeceğim
    @ManyToMany(() => User, (user) => user.animals)
    @JoinTable()
    users: User[];

    // vaccine entity'sini hazırladıktan sonra buraya OneToMany ilişkisi ekleyeceğim
    @OneToMany(() => Vaccine, (vaccine) => vaccine.animal)
    vaccines: Vaccine[];
}