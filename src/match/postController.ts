import BasicController from '../api/basicController';
import MatchCreator from './matchCreator';

export default class MatchPostController extends BasicController {
  path: string;
  matchCreator: MatchCreator;

  constructor(
    path: string,
    matchCreator: MatchCreator,
  ) {
    super('POST', path);
    this.matchCreator = matchCreator;
  }

  get validation() {
    return {
      type: 'object',
      required: ['userLoserIds', 'userWinnerIds'],
      properties: {
        userLoserIds: { type: 'array' },
        userWinnerIds: { type: 'array' },
        date: { type: 'date' },
      }
    };
  }

  async handle(req, res, next) {
    const { userLoserIds, userWinnerIds, date } = req.body;

    await this.matchCreator.create(userLoserIds, userWinnerIds, date);

    return res.status(200).send('ok');
  }
}
