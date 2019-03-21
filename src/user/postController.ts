import { Repository, DeepPartial } from 'typeorm';

import { User } from './';

import { BasicController } from './../api';
import { Hasher } from '../utils';

export class UserPostController extends BasicController {
  path: string;
  repository: Repository<User>;
  hasher: Hasher;

  constructor(path, repository, hasher: Hasher) {
    super('POST', path);
    this.repository = repository;
    this.hasher = hasher;
  }

  get validation() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'elo'],
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        elo: { type: 'number' },
        participants: { type: 'number' },
      },
    };
  }

  async handle(req, res, next) {
    const userData: DeepPartial<User> = req.body;
    const user: User = await this.repository.create(userData);
    
    let { password } = user;
    if (password) {
      const salt = await this.hasher.generateSalt();
      user.password = await this.hasher.hash(password, salt);
      user.salt = salt;
    }

    const savedUser = await this.repository.save(user);

    return res.send(savedUser);
  }
}
