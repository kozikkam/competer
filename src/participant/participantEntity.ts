import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from './../user';
import { Match } from './../match';

@Entity()
export class Participant {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.participants)
    user: User;

    @ManyToOne(type => Match, match => match.participants)
    match: Match;

    @Column()
    previousElo: number;

    @Column()
    newElo?: number;

    @Column()
    winner?: boolean;

    @Column({ nullable: true })
    eloChange?: number;
}
