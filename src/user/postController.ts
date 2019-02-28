import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import UserEntity from './userEntity';

export default class UserPostController extends BasicController {
  path: string;
  repository: Repository<UserEntity>;

  constructor(path: string, repository: Repository<UserEntity>) {
    super('POST', path);
    this.repository = repository;
  }

  get validation() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'elo'],
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        elo: { type: 'number' },
        participants: { type: 'number' },
      }
    };
  }

  async handle(req, res, next) {
    const result = await this.repository.save(req.body);

    return res.send(result);
  }
}
