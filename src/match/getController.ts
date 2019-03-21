import { Repository } from 'typeorm';

import { BasicController } from '../api';
import { Match } from './';

export class MatchGetController extends BasicController {
  path: string;
  repository: Repository<Match>;

  constructor(path: string, repository: Repository<Match>) {
    super('GET', path);
    this.repository = repository;
  }

  async handle(req, res, next) {
    let rows;

    if (req.params.id) {
      rows = await this.repository
        .createQueryBuilder('match')
        .select([
          'match.date',
          'participant.previousElo',
          'participant.newElo',
          'participant.eloChange',
          'user.firstName',
          'user.lastName',
        ])
        .leftJoin('match.participants', 'participant')
        .leftJoin('participant.user', 'user')
        .where({ id: req.params.id })
        .getOne();

      return res.send(rows);
    }
    rows = await this.repository.find({ relations: ['participants', 'participants.user'] });

    return res.send(rows);
  }
}
