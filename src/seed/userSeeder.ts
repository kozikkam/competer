import { Repository } from 'typeorm';

import { User } from '../user';

export class UserSeeder {
  userRepository: Repository<User>;

  constructor(
    userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

  async seed(users: Array<string>): Promise<void> {
    for (const user of users) {
      const [firstName, lastName] = user.split(/\s/);

      await this.userRepository.save({
        firstName,
        lastName,
      });
    }
  }
}