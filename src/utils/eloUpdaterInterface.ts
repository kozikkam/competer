import { Repository } from 'typeorm';

import ParticipantEntity from './../participant/participantEntity';
import UserEntity from './../user/userEntity';

export default interface EloUpdaterInterface {
  userRepository: Repository<UserEntity>;

  updateAll(participants: Array<ParticipantEntity>, value: number): void;
  updateSingle(participant: ParticipantEntity, value: number): void;
}