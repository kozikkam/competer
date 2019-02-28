import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import MatchEntity from './matchEntity';

export default class UserGetController extends BasicController {
  path: string;
  repository: Repository<MatchEntity>;

  constructor(path: string, repository: Repository<MatchEntity>) {
    super('GET', path);
    this.repository = repository;
  }

  async handle(req, res, next) {
    let rows;

    if (req.params.id) {
      rows = await this.repository.findOne({ where: { id: req.params.id }, relations: ['participants', 'user'] });

      return res.send(rows);
    }
    rows = await this.repository.find({ relations: ['participants', 'participants.user'] });

    return res.send(rows);
  }
}
