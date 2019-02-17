import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}