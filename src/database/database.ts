import { createConnection, ConnectionOptions, Connection } from 'typeorm';

import UserEntity from './../user/userEntity';
import MatchEntity from './../match/matchEntity';
import ParticipantEntity from './../participant/participantEntity';

export default class Database {
  async getConnection(): Promise<Connection> {
    const options: ConnectionOptions = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        MatchEntity,
        ParticipantEntity,
      ],
      synchronize: true,
    };

    return createConnection(options);
  }
}
