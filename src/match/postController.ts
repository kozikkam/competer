import { Repository } from 'typeorm';

import BasicController from '../api/basicController';
import MatchEntity from './matchEntity';

export default class MatchPostController extends BasicController {
  path: string;
  method: string;
  repository: Repository<MatchEntity>;

  constructor(path: string, repository: Repository<MatchEntity>) {
    super('POST', path);
    this.repository = repository;
  }

  get validation() {
    return {
      type: 'object',
      required: [],
      properties: {
        participants: { type: 'number' },
      }
    };
  }

  async handle(req, res, next) {
    const result = await this.repository.save(req.body);

    return res.send(result);
  }
}
