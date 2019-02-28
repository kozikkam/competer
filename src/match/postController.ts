import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import MatchEntity from './matchEntity';
import ParticipantEntity from '../participant/participantEntity';
import UserEntity from '../user/userEntity';

import EloCalculatorInterface from './../utils/eloCalculatorInterface';
import EloUpdaterInterface from './../utils/eloUpdaterInterface';

export default class MatchPostController extends BasicController {
  path: string;
  method: string;
  matchRepository: Repository<MatchEntity>;
  participantRepository: Repository<ParticipantEntity>;
  userRepository: Repository<UserEntity>;
  eloCalculator: EloCalculatorInterface;
  eloUpdater: EloUpdaterInterface;

  constructor(
    path: string,
    matchRepository: Repository<MatchEntity>,
    participantRepository: Repository<ParticipantEntity>,
    userRepository: Repository<UserEntity>,
    eloCalculator: EloCalculatorInterface,
    eloUpdater: EloUpdaterInterface,
  ) {
    super('POST', path);

    this.matchRepository = matchRepository;
    this.participantRepository = participantRepository;
    this.userRepository = userRepository;
    this.eloCalculator = eloCalculator;
    this.eloUpdater = eloUpdater;
  }

  get validation() {
    return {
      type: 'object',
      required: [],
      properties: {
        userLoserIds: { type: 'array' },
        userWinnerIds: { type: 'array' },
      }
    };
  }

  async handle(req, res, next) {
    const { userLoserIds, userWinnerIds } = req.body;
    const userIds = userLoserIds.concat(userWinnerIds);
    const participants = [];

    const match = await this.matchRepository.create();
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
      });

      participants.push(participant);
    }

    const eloDifference = this.eloCalculator.calculate(participants);
    this.eloUpdater.updateAll(participants, eloDifference);
    match.participants = participants;

    await this.participantRepository.save(participants);
    await this.matchRepository.save(match);

    return res.status(200).send('ok');
  }
}
