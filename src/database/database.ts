import { createConnection, ConnectionOptions, Connection } from 'typeorm';

import { User } from './../user';
import { Match } from './../match';
import { Participant } from './../participant';

export class Database {
  async getConnection(): Promise<Connection> {
    const options: ConnectionOptions = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Match,
        Participant,
      ],
      synchronize: true,
    };

    return createConnection(options);
  }
}
