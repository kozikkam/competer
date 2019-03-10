import { Repository } from 'typeorm';

import UserSeeder from './userSeeder';
import MatchSeeder from './matchSeeder';

import MatchCreator from './../match/matchCreator';
import User from './../user/userEntity';

export default class Seeder {
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
