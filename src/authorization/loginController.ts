import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { BasicController } from '../api';
import { User } from './../user';
import { Hasher } from '../utils';

export class LoginController extends BasicController {
  path: string;
  repository: Repository<User>;
  hasher: Hasher;

  constructor(path: string, repository: Repository<User>, hasher: Hasher) {
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
        remember: { type: 'boolean' },
      }
    };
  }

  async handle(req, res, next) {
    const { email, password, remember } = req.body;

    const user = await this.repository.findOne({ where: { email } });

    if (!user) {
      return res.status(403).send({ message: 'Wrong username or password' });
    }
    
    const equal = await this.hasher.isEqual(password, user.salt, user.password);

    if (!equal) {
      return res.status(403).send({ message: 'Wrong username or password' });
    }

    let token;
    if (remember) {
      token = this.signJWT(email, '7d');
    } else {
      token = this.signJWT(email);
    }

    res.status(200).send({ email, token });
  }

  signJWT(email, expiresIn = '10m') {
    return jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn,
      },
    );
  }
}
