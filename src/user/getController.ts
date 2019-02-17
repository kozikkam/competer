import { Repository } from 'typeorm';

import BasicController from '../api/basicController';

export default class UserGetController<Entity> extends BasicController {
  path: string;
  method: string;
  repository: Repository<Entity>;

  constructor(path: string, repository: Repository<Entity>) {
    super('GET', path);
    this.repository = repository;
  }

  get validation() {
    return false;
  }

  async handle(req, res, next) {
    if (req.params.id) {
      return res.send(await this.repository.findOne(req.params.id));
    }

    return res.send(await this.repository.find());
  }
}
