import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as Ajv from 'ajv';

import * as config from './../config';
import EnvValidator from './config/envValidator';

const envValidator = new EnvValidator(config.requiredEnvs);
envValidator.validateEnv();

import * as express from 'express';

const app = express();
const port = process.env.SERVER_PORT || 3000;

import Database from './database/database';
import UserEntity from './user/userEntity';
import MatchEntity from './match/matchEntity';
import ParticipantEntity from './participant/participantEntity';

import ControllerManager from './api/controllerManager';
import UserGetController from './user/getController';
import UserPostController from './user/postController';
import MatchPostController from './match/postController';
import MatchGetController from './match/getController';

import MatchCreator from './match/matchCreator';

import EloCalculator from './utils/eloCalculator';
import EloUpdater from './utils/eloUpdater';

import { Connection, Repository } from 'typeorm';

import BasicController from './api/basicController';

import Seeder from './seed/seeder';

async function bootstrap(): Promise<void> {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());

  const database: Database = new Database();
  const connection: Connection = await database.getConnection();

  const userRepository: Repository<UserEntity> = connection.getRepository('user');
  const matchRepository: Repository<MatchEntity> = connection.getRepository('match');
  const participantRepository: Repository<ParticipantEntity> = connection.getRepository('participant');

  const eloCalculator = new EloCalculator(100);
  const eloUpdater = new EloUpdater(userRepository);
  const matchCreator = new MatchCreator(
    matchRepository, participantRepository, userRepository, eloCalculator, eloUpdater,
  );

  const userGetController = new UserGetController('/user/:id?', userRepository);
  const userPostController = new UserPostController('/user', userRepository);

  const matchPostController = new MatchPostController('/match', matchCreator);
  const matchGetController = new MatchGetController('/match/:id?', matchRepository);
  
  const controllers: Array<BasicController> = [
    userGetController,
    userPostController,
    matchPostController,
    matchGetController,
  ];
  
  const validator = new Ajv();
  const controllerManager = new ControllerManager(app, validator);
  controllerManager.addControllers(controllers);

  app.listen(port, async () => {
    console.log(`app listening on port ${port}`);

    const seeder = new Seeder(userRepository, matchCreator);
    await seeder.seed();
  });
}

bootstrap();
