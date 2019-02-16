import { Repository } from 'typeorm';

import BasicController from '../basicController';

export default class UserController<Entity> implements BasicController {
  path: string;
  method: string;
  repository: Repository<Entity>;

  constructor(path: string, method: string, repository: Repository<Entity>) {
    this.path = path;
    this.method = method;
    this.repository = repository;
  }

  handle(req, res, next): void {
    res.send({ hello: 'world' });
  }
}
