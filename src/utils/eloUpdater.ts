import { Repository } from 'typeorm';


import { EloUpdaterInterface } from './';

import { Participant } from './../participant';
import { User } from './../user';

export class EloUpdater implements EloUpdaterInterface {
  userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async updateAll(participants: Array<Participant>, value: number) {
    for (const participant of participants) {
      await this.updateSingle(participant, value);
    }
  }

  async updateSingle(participant: Participant, value: number) {
    let eloChange = value;

    if (!participant.winner && eloChange > 0) {
      eloChange = -value;
    }

    participant.eloChange = eloChange;
    participant.user.elo += eloChange;
    participant.newElo = participant.user.elo;

    await this.userRepository.save(participant.user);
  }
}