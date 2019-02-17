import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import ParticipantEntity from './../participant/participantEntity';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    elo: number;

    @OneToMany(type => ParticipantEntity, participant => participant.user)
    participants?: ParticipantEntity[];
}