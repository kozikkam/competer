import { Repository } from 'typeorm';

import { UserSeeder, MatchSeeder } from './';

import { MatchCreator } from './../match';
import { User, UserCreator } from './../user';

export class Seeder {
  matchCreator: MatchCreator;
  userCreator: UserCreator;
  userRepository: Repository<User>;

  constructor(matchCreator: MatchCreator, userCreator: UserCreator, userRepository: Repository<User>) {
    this.userCreator = userCreator;
    this.matchCreator = matchCreator;
    this.userRepository = userRepository;
  }

  async seed() {
    const seedData = require('./../database/seedData');

    const userSeeder = new UserSeeder(this.userCreator);
    const matchSeeder = new MatchSeeder(this.userRepository, this.matchCreator);
    console.log('seeding users...');
    await userSeeder.seed(seedData.users);
    console.log('seeding matches...');
    await matchSeeder.seed(seedData.matches);
  }
}
