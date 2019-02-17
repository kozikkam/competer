import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import UserEntity from './userEntity';

export default class UserGetController extends BasicController {
  path: string;
  method: string;
  repository: Repository<UserEntity>;

  constructor(path: string, repository: Repository<UserEntity>) {
    super('GET', path);
    this.repository = repository;
  }

  async handle(req, res, next) {
    let rows;

    if (req.params.id) {
      rows = await this.repository.findOne({ where: { id: req.params.id }, relations: ['participants'] });

      return res.send(rows);
    }
    rows = await this.repository.find({ relations: ['participants'] });

    return res.send(rows);
  }
}
