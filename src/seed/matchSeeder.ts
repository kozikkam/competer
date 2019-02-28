import { Repository } from 'typeorm';

import MatchEntity from './../match/matchEntity';
import UserEntity from './../user/userEntity';
import ParticipantEntity from './../participant/participantEntity';
import MatchCreator from '../match/matchCreator';

interface match {
  date: string;
  participants: participants;
}

interface participants {
  win: Array<string>;
  lose: Array<string>;
}

export default class UserSeeder {
  matches: Array<match>;
  matchRepository: Repository<MatchEntity>;
  userRepository: Repository<UserEntity>;
  participantRepository: Repository<ParticipantEntity>;
  matchCreator: MatchCreator;

  constructor(
    matches: Array<match>,
    matchRepository: Repository<MatchEntity>,
    userRepository: Repository<UserEntity>,
    participantRepository: Repository<ParticipantEntity>,
    matchCreator: MatchCreator,
  ) {
    this.matches = matches;
    this.matchRepository = matchRepository;
    this.userRepository = userRepository;
    this.participantRepository = participantRepository;
    this.matchCreator = matchCreator;
  }

  async seed() {
    for (const match of this.matches) {
      const { date, participants } = match;
      const userLoserIds = (await this.getUsers(participants.lose)).map(user => user.id);
      const userWinnerIds = (await this.getUsers(participants.win)).map(user => user.id);

      await this.matchCreator.create(userWinnerIds, userLoserIds, date)
    }
  }

  async getUser(userName): Promise<UserEntity> {
    const [firstName, lastName] = userName.split(/\s/);
      
    const user = await this.userRepository.find({
      where: {
        firstName,
        lastName
      },
    });

    return user[0];
  }

  async getUsers(participantNames): Promise<Array<UserEntity>> {
    const users = [];

    for (const name of participantNames) {
      const user = await this.getUser(name);
      users.push(user);
    }

    return users;
  }
}