import { Entity, PrimaryGeneratedColumn, Column, OneToMany, RelationCount } from 'typeorm';

import ParticipantEntity from './../participant/participantEntity';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @RelationCount((user: User) => user.participants)
    matchCount: number;

    @Column({ default: 1000 })
    elo?: number;

    @OneToMany(type => ParticipantEntity, participant => participant.user)
    participants?: ParticipantEntity[];
}
