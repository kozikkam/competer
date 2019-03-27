import { DeepPartial } from 'typeorm';

import { User } from './';

import { BasicController } from './../api';
import { UserCreator } from './userCreator';

export class UserPostController extends BasicController {
  path: string;
  userCreator: UserCreator;

  constructor(path: string, userCreator: UserCreator) {
    super('POST', path);
    this.userCreator = userCreator;
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
    const savedUser = await this.userCreator.create(userData);

    return res.send(savedUser);
  }
}
