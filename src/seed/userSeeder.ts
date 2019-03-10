import { Repository } from 'typeorm';

import UserEntity from '../user/userEntity';

export default class UserSeeder {
  userRepository: Repository<UserEntity>;

  constructor(
    userRepository: Repository<UserEntity>,
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