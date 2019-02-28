import { Repository } from 'typeorm';


import EloUpdaterInterface from './eloUpdaterInterface';

import ParticipantEntity from './../participant/participantEntity';
import UserEntity from './../user/userEntity';

export default class EloUpdater implements EloUpdaterInterface {
  userRepository: Repository<UserEntity>;

  constructor(userRepository: Repository<UserEntity>) {
    this.userRepository = userRepository;
  }

  async updateAll(participants: Array<ParticipantEntity>, value: number) {
    for (const participant of participants) {
      await this.updateSingle(participant, value);
    }
  }

  async updateSingle(participant: ParticipantEntity, value: number) {
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