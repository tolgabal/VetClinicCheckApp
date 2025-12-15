import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "../animal/animal.entity";


@Entity()
export class AnimalType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Animal, (animal) => animal.animalType)
    animals: Animal[];
}