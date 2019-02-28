import { Repository } from 'typeorm';

import UserEntity from '../user/userEntity';

export default class UserSeeder {
  users: Array<string>;
  userRepository: Repository<UserEntity>;

  constructor(
    users: Array<string>,
    userRepository: Repository<UserEntity>,
  ) {
    this.users = users;
    this.userRepository = userRepository;
  }

  async seed() {
    for (const user of this.users) {
      const [firstName, lastName] = user.split(/\s/);

      await this.userRepository.save({
        firstName,
        lastName,
      });
    }
  }
}