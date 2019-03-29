import * as bodyParser from 'body-parser';
import * as Ajv from 'ajv';
import { Connection, Repository } from 'typeorm';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';

import * as config from './../config';
import { EnvValidator } from './config/envValidator';

const envValidator = new EnvValidator(config.requiredEnvs);
envValidator.validateEnv();

const app = express();
const port = process.env.PORT || 3000;

import { Database } from './database';
import { User, UserGetController, UserPostController, UserCreator } from './user';
import { Match, MatchGetController, MatchPostController, MatchCreator } from './match';
import { Participant } from './participant';
import { BasicController, ControllerManager } from './api';
import { LoginController, AuthMiddleware, TokenChecker, TokenExtractor, CheckJWTController } from './authorization';
import { EloCalculator, EloUpdater, Hasher } from './utils';
import { Seeder } from './seed';
import { Graphql } from './graphql';

async function bootstrap(): Promise<void> {
  const tokenExtractor = new TokenExtractor();
  const tokenChecker = new TokenChecker();
  const checkJWTController = new CheckJWTController('/check-jwt', tokenChecker, tokenExtractor);
  const authMiddleware = new AuthMiddleware(tokenChecker, tokenExtractor);

  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(authMiddleware.verify([
    {
      path: new RegExp('^(?!\/?login).*$'), methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  ]));

  const database: Database = new Database();
  const connection: Connection = await database.getConnection();

  const userRepository: Repository<User> = connection.getRepository('user');
  const matchRepository: Repository<Match> = connection.getRepository('match');
  const participantRepository: Repository<Participant> = connection.getRepository('participant');

  const eloCalculator = new EloCalculator(100);
  const eloUpdater = new EloUpdater(userRepository);
  const hasher = new Hasher();

  const matchCreator = new MatchCreator(
    matchRepository, participantRepository, userRepository, eloCalculator, eloUpdater,
  );

  const userGetController = new UserGetController('/user/:id?', userRepository);
  const userCreator = new UserCreator(hasher, userRepository);
  const userPostController = new UserPostController('/user', userCreator);

  const matchPostController = new MatchPostController('/match', matchCreator);
  const matchGetController = new MatchGetController('/match/:id?', matchRepository);

  const loginController = new LoginController('/login', userRepository, hasher);
  
  const controllers: Array<BasicController> = [
    checkJWTController,
    userGetController,
    userPostController,
    matchPostController,
    matchGetController,
    loginController,
  ];
  
  const validator = new Ajv();
  const controllerManager = new ControllerManager(app, validator);
  controllerManager.addControllers(controllers);

  const graphql = new Graphql(app);
  graphql.init(userGetController);

  app.listen(port, async () => {
    console.log(`app listening on port ${port}`);

    const seeder = new Seeder(matchCreator, userCreator, userRepository);
    await seeder.seed();
  });
}

bootstrap();
