import { UserCreator } from '../user';

export class UserSeeder {
  userCreator: UserCreator;

  constructor(
    userCreator: UserCreator,
  ) {
    this.userCreator = userCreator;
  }

  async seed(users: Array<string>): Promise<void> {
    for (const user of users) {
      const [firstName, lastName, email, password] = user.split(/\s/);

      await this.userCreator.create({
        firstName,
        lastName,
        email,
        password,
      });
    }
  }
}