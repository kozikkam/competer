import { Repository } from 'typeorm';

import { User } from './../user';
import { MatchCreator } from '../match';

interface match {
  date: string;
  participants: participants;
}

interface participants {
  win: Array<string>;
  lose: Array<string>;
}

export class MatchSeeder {
  userRepository: Repository<User>;
  matchCreator: MatchCreator;

  constructor(
    userRepository: Repository<User>,
    matchCreator: MatchCreator,
  ) {
    this.userRepository = userRepository;
    this.matchCreator = matchCreator;
  }

  async seed(matches: Array<match>) {
    for (const match of matches) {
      const { date, participants } = match;
      const userLoserIds = (await this.getUsers(participants.lose)).map(user => user.id);
      const userWinnerIds = (await this.getUsers(participants.win)).map(user => user.id);

      await this.matchCreator.create(userWinnerIds, userLoserIds, date)
    }
  }

  async getUser(userName): Promise<User> {
    const [firstName, lastName] = userName.split(/\s/);
      
    const user = await this.userRepository.find({
      where: {
        firstName,
        lastName
      },
    });

    return user[0];
  }

  async getUsers(participantNames): Promise<Array<User>> {
    const users = [];

    for (const name of participantNames) {
      const user = await this.getUser(name);
      users.push(user);
    }

    return users;
  }
}