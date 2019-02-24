import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import MatchEntity from './matchEntity';
import ParticipantEntity from '../participant/participantEntity';
import UserEntity from '../user/userEntity';

export default class MatchPostController extends BasicController {
  path: string;
  method: string;
  matchRepository: Repository<MatchEntity>;
  participantRepository: Repository<ParticipantEntity>;
  userRepository: Repository<UserEntity>;

  constructor(
    path: string,
    matchRepository: Repository<MatchEntity>,
    participantRepository: Repository<ParticipantEntity>,
  ) {
    super('POST', path);

    this.matchRepository = matchRepository;
    this.participantRepository = participantRepository;
  }

  get validation() {
    return {
      type: 'object',
      required: [],
      properties: {
        userIds: { type: 'array' },
        userWinnerIds: { type: 'array' },
      }
    };
  }

  async handle(req, res, next) {
    const { userIds, userWinnerIds } = req.body;
    const participants = [];

    const match = await this.matchRepository.create();
    
    for (let id of userIds) {
      let winner = false;

      if (userWinnerIds.includes(id)) {
        winner = true;
      }

      const participant = await this.participantRepository.create({
        user: id,
        match,
        winner,
        eloChange: -10,
      });

      participants.push(participant);
    }

    match.participants = participants;
    await this.matchRepository.save(match);

    return res.status(200).send('ok');
  }
}
