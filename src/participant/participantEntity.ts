import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import UserEntity from './../user/userEntity';
import TeamEntity from './../team/teamEntity';
import MatchEntity from './../match/matchEntity';

@Entity()
export default class Participant {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TeamEntity)
    team: TeamEntity;

    @ManyToOne(type => UserEntity, user => user.participants)
    user: UserEntity;

    @ManyToOne(type => MatchEntity, match => match.participants)
    match: MatchEntity;

    @Column()
    winner?: boolean;

    @Column()
    eloChange?: number;
}
