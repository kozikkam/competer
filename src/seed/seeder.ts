import { Repository } from 'typeorm';

import { UserSeeder, MatchSeeder } from './';

import { MatchCreator } from './../match';
import { User } from './../user';

export class Seeder {
  userRepository: Repository<User>;
  matchCreator: MatchCreator;

  constructor(userRepository, matchCreator) {
    this.userRepository = userRepository;
    this.matchCreator = matchCreator;
  }

  async seed() {
    const seedData = require('./../database/seedData');

    const userSeeder = new UserSeeder(this.userRepository);
    const matchSeeder = new MatchSeeder(this.userRepository, this.matchCreator);
    console.log('seeding users...');
    await userSeeder.seed(seedData.users);
    console.log('seeding matches...');
    await matchSeeder.seed(seedData.matches);
  }
}
