import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "../animal/animal.entity";


@Entity()
export class Vaccine {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    lastVaccinationDate: Date;

    @Column()
    nextVaccinationDate: Date;

    @ManyToOne(() => Animal, (animal) => animal.vaccines)
    animal: Animal;
}