import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import TeamEntity from './teamEntity';

export default class MatchPostController extends BasicController {
  path: string;
  method: string;
  repository: Repository<TeamEntity>;

  constructor(path: string, repository: Repository<TeamEntity>) {
    super('POST', path);
    this.repository = repository;
  }

  get validation() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      }
    };
  }

  async handle(req, res, next) {
    const result = await this.repository.save(req.body);

    return res.send(result);
  }
}
