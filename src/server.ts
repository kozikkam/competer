import * as config from './../config';
import EnvManager from './envManager';

const envManager = new EnvManager(config.requiredEnvs);
envManager.validateEnv();

import * as express from 'express';

const app = express();
const port = 3000;

import Database from './database';
import UserEntity from './user/userEntity';

import ControllerManager from './controllerManager';
import UserController from './user/userController';

import { Connection, Repository } from 'typeorm';

import BasicController from './basicController';

async function bootstrap(): Promise<void> {
  const database: Database = new Database();
  const connection: Connection = await database.getConnection([
    UserEntity,
  ]);
  const userRepository: Repository<UserEntity> = connection.getRepository('user');
  
  const controllerManager = new ControllerManager(app);
  const userController = new UserController<UserEntity>('/user', 'get', userRepository);
  
  const controllers: Array<BasicController> = [userController];
  
  controllerManager.addControllers(controllers);

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
}

bootstrap();
