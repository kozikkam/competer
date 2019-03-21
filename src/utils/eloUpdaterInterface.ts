import { Repository } from 'typeorm';

import { Participant } from './../participant';
import { User } from './../user';

export interface EloUpdaterInterface {
  userRepository: Repository<User>;

  updateAll(participants: Array<Participant>, value: number): void;
  updateSingle(participant: Participant, value: number): void;
}