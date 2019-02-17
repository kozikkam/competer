import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import MatchEntity from './matchEntity';

export default class UserGetController extends BasicController {
  path: string;
  method: string;
  repository: Repository<MatchEntity>;

  constructor(path: string, repository: Repository<MatchEntity>) {
    super('GET', path);
    this.repository = repository;
  }

  async handle(req, res, next) {
    let rows;

    if (req.params.id) {
      rows = await this.repository.findOne(req.params.id);

      return res.send(rows);
    }
    rows = await this.repository.find();

    return res.send(rows);
  }
}
