import { Repository, DeepPartial } from 'typeorm';

import { User } from './';
import { Hasher } from '../utils';

export class UserCreator {
  hasher: Hasher;
  repository: Repository<User>;

  constructor(
    hasher: Hasher,
    repository: Repository<User>,
  ) {
    this.hasher = hasher;
    this.repository = repository;
  }

  async create(userData: DeepPartial<User>) {
    const user: User = await this.repository.create(userData);
    
    let { password } = user;
    if (password) {
      const salt = await this.hasher.generateSalt();
      user.password = await this.hasher.hash(password, salt);
      user.salt = salt;
    }

    const savedUser = await this.repository.save(user);

    return savedUser;
  }
}
