import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import ParticipantEntity from './../participant/participantEntity';

@Entity()
export default class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => ParticipantEntity, participant => participant.match)
    participants?: ParticipantEntity[];
}
