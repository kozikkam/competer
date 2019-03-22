import { Entity, PrimaryGeneratedColumn, Column, OneToMany, RelationCount } from 'typeorm';

import { Participant } from '../participant';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @RelationCount((user: User) => user.participants)
  matchCount: number;

  @Column({ default: 1000 })
  elo?: number;

  @OneToMany(type => Participant, participant => participant.user)
  participants?: Participant[];
}
