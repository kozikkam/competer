import { Repository } from 'typeorm';

import BasicController from '../api/basicController';

export default class UserPostController<Entity> extends BasicController {
  path: string;
  method: string;
  repository: Repository<Entity>;

  constructor(path: string, repository: Repository<Entity>) {
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
      }
    };
  }

  async handle(req, res, next) {
    const result = await this.repository.create(req.body);

    return res.send(result);
  }
}
