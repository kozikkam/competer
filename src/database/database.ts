import { createConnection, ConnectionOptions, Connection } from 'typeorm';

export default class Database {
  async getConnection(entities: any[]): Promise<Connection> {
    const options: ConnectionOptions = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities,
      synchronize: true,
    };

    return createConnection(options);
  }
}
