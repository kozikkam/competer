import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import ParticipantEntity from './participantEntity';

export default class MatchPostController extends BasicController {
  path: string;
  method: string;
  repository: Repository<ParticipantEntity>;

  constructor(path: string, repository: Repository<ParticipantEntity>) {
    super('POST', path);
    this.repository = repository;
  }

  get validation() {
    return {
      type: 'object',
      required: ['team', 'user', 'match'],
      properties: {
        team: { type: 'number' },
        user: { type: 'number' },
        match: { type: 'number' },
        winner: { type: 'boolean' },
        eloChange: { type: 'number' },
      }
    };
  }

  async handle(req, res, next) {
    const result = await this.repository.save(req.body);

    return res.send(result);
  }
}
