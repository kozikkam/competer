import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';

import { Participant } from './../participant';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: new Date() })
    date?: Date;

    @OneToMany(type => Participant, participant => participant.match, { cascade: true })
    participants: Participant[];
}
