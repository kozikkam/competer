import { Repository } from 'typeorm';

import { Match } from './';
import { Participant } from '../participant';
import { User } from '../user';

import { EloCalculatorInterface, EloUpdaterInterface } from './../utils';

export class MatchCreator {
  matchRepository: Repository<Match>;
  participantRepository: Repository<Participant>;
  userRepository: Repository<User>;
  eloCalculator: EloCalculatorInterface;
  eloUpdater: EloUpdaterInterface;

  constructor(
    matchRepository: Repository<Match>,
    participantRepository: Repository<Participant>,
    userRepository: Repository<User>,
    eloCalculator: EloCalculatorInterface,
    eloUpdater: EloUpdaterInterface,
  ) {
    this.matchRepository = matchRepository;
    this.participantRepository = participantRepository;
    this.userRepository = userRepository;
    this.eloCalculator = eloCalculator;
    this.eloUpdater = eloUpdater;
  }

  async create(userWinnerIds: Array<number>, userLoserIds: Array<number>, date: string): Promise<void> {
    const userIds = userLoserIds.concat(userWinnerIds);
    const participants = [];

    const match = await this.matchRepository.create({ date });
    await this.matchRepository.save(match);
    
    for (let id of userIds) {
      let winner = false;

      if (userWinnerIds.includes(id)) {
        winner = true;
      }

      const user = await this.userRepository.findOne(id);
      const participant = await this.participantRepository.create({
        user,
        match,
        winner,
        previousElo: user.elo,
      });

      participants.push(participant);
    }

    const eloDifference = this.eloCalculator.calculate(participants);
    await this.eloUpdater.updateAll(participants, eloDifference);
    match.participants = participants;

    await this.participantRepository.save(participants);
    await this.matchRepository.save(match);
  }
}
