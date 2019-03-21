import { Repository } from 'typeorm';

import { BasicController } from '../api';
import { User } from './';

export class UserGetController extends BasicController {
  path: string;
  repository: Repository<User>;

  constructor(path: string, repository: Repository<User>) {
    super('GET', path);
    this.repository = repository;
  }

  async handle(req, res, next) {
    let rows;

    if (req.params.id) {
      rows = await this.repository
        .createQueryBuilder('user')
        .select([
          'user.firstName',
          'user.lastName',
          'user.elo',
          'participant.previousElo',
          'participant.newElo',
          'participant.eloChange',
          'match.date',
          'ps.previousElo',
          'ps.newElo',
          'ps.eloChange',
          'us.firstName',
          'us.lastName',
        ])
        .leftJoin('user.participants', 'participant')
        .leftJoin('participant.match', 'match')
        .leftJoin('match.participants', 'ps')
        .leftJoin('ps.user', 'us')
        .where({ id: req.params.id })
        .getOne();

      return res.send(rows);
    }
    rows = await this.repository.find({
      select: ['firstName', 'lastName', 'elo'],
      order: { elo: 'DESC' }
    });

    return res.send(rows);
  }
}
