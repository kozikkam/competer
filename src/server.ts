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
import UserGetController from './user/get';
import UserPostController from './user/post';

import { Connection, Repository } from 'typeorm';

import BasicController from './basicController';

import * as bodyParser from 'body-parser';
import * as Ajv from 'ajv';

async function bootstrap(): Promise<void> {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  const validator = new Ajv();

  const database: Database = new Database();
  const connection: Connection = await database.getConnection([
    UserEntity,
  ]);
  const userRepository: Repository<UserEntity> = connection.getRepository('user');
  const controllerManager = new ControllerManager(app, validator);
  const userGetController = new UserGetController<UserEntity>('/user/:id', userRepository);
  const userPostController = new UserPostController<UserEntity>('/user', userRepository);
  
  const controllers: Array<BasicController> = [
    userGetController,
    userPostController
  ];
  
  controllerManager.addControllers(controllers);

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
}

bootstrap();
