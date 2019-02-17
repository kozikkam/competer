import * as config from './../config';
import EnvValidator from './config/envValidator';

const envValidator = new EnvValidator(config.requiredEnvs);
envValidator.validateEnv();

import * as express from 'express';

const app = express();
const port = 3000;

import Database from './database/database';
import UserEntity from './user/userEntity';
import TeamEntity from './team/teamEntity';
import MatchEntity from './match/matchEntity';
import ParticipantEntity from './participant/participantEntity';

import ControllerManager from './api/controllerManager';
import UserGetController from './user/getController';
import UserPostController from './user/postController';
import TeamPostController from './team/postController';
import ParticipantPostController from './participant/postController';
import MatchPostController from './match/postController';
import MatchGetController from './match/getController';

import { Connection, Repository } from 'typeorm';

import BasicController from './api/basicController';

import * as bodyParser from 'body-parser';
import * as Ajv from 'ajv';

async function bootstrap(): Promise<void> {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  const database: Database = new Database();
  const connection: Connection = await database.getConnection([
    UserEntity,
    TeamEntity,
    MatchEntity,
    ParticipantEntity,
  ]);

  const userRepository: Repository<UserEntity> = connection.getRepository('user');
  const teamRepository: Repository<TeamEntity> = connection.getRepository('team');
  const matchRepository: Repository<MatchEntity> = connection.getRepository('match');
  const participantRepository: Repository<ParticipantEntity> = connection.getRepository('participant');

  const userGetController = new UserGetController('/user/:id?', userRepository);
  const userPostController = new UserPostController('/user', userRepository);

  const teamPostController = new TeamPostController('/team', teamRepository);

  const matchPostController = new MatchPostController('/match/:id?', matchRepository);
  const matchGetController = new MatchGetController('/match', matchRepository);

  const participantPostController = new ParticipantPostController('/participant', participantRepository);
  
  const controllers: Array<BasicController> = [
    userGetController,
    userPostController,
    teamPostController,
    matchPostController,
    matchGetController,
    participantPostController,
  ];
  
  const validator = new Ajv();
  const controllerManager = new ControllerManager(app, validator);
  controllerManager.addControllers(controllers);

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
}

bootstrap();
