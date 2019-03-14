import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import BasicController from '../api/basicController';
import UserEntity from './../user/userEntity';
import Hasher from '../utils/hasher';

export default class UserGetController extends BasicController {
  path: string;
  repository: Repository<UserEntity>;
  hasher: Hasher;

  constructor(path: string, repository: Repository<UserEntity>, hasher: Hasher) {
    super('POST', path);
    this.repository = repository;
    this.hasher = hasher;
  }

  get validation() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      }
    };
  }

  async handle(req, res, next) {
    const { email, password } = req.body;

    const user = await this.repository.findOne({ where: { email } });

    if (!user) {
      return res.status(403).send('Wrong username or password');
    }
    
    const equal = await this.hasher.isEqual(password, user.salt, user.password);

    if (!equal) {
      return res.status(403).send('Wrong username or password');
    }

    const token = this.signJWT(email);

    res.status(200).send({ email, token });
  }

  signJWT(email) {
    return jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '10m',
      },
    );
  }
}
