import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
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

    @Column({ default: new Date() })
    date?: Date;

    @OneToMany(type => ParticipantEntity, participant => participant.match, { cascade: true })
    participants: ParticipantEntity[];
}
