import { Repository } from 'typeorm';

import { User } from './'
import { Participant } from './../participant';
import { BasicController } from './../api';

interface Response {
  firstName: string;
  lastName: string;
  elo: number;
  participants: Array<Participant>;
}

export class UserGetController extends BasicController {
  path: string;
  repository: Repository<User>;
  pageSize: number;

  constructor(path: string, repository: Repository<User>, pageSize = 10) {
    super('GET', path);
    this.repository = repository;
    this.pageSize = pageSize;
  }

  getPage(rows: Response, page: number) {
    return {
      ...rows,
      participants: rows.participants
        .filter((participant, index) => index >= this.pageSize * (page-1) && index < this.pageSize * page)
    };
  }

  async handle(req, res, next) {
    let rows;

    if (req.params.id) {
      const page = req.query.page && req.query.page > 0 ? req.query.page : 1;

      rows = await this.repository
        .createQueryBuilder('user')
        .select([
          'user.firstName',
          'user.lastName',
          'user.elo',
          'participant.previousElo',
          'participant.newElo',
          'participant.eloChange',
          'participant.winner',
          'match.date',
          'ps.previousElo',
          'ps.newElo',
          'ps.eloChange',
          'ps.winner',
          'us.firstName',
          'us.lastName',
        ])
        .leftJoin('user.participants', 'participant')
        .leftJoin('participant.match', 'match')
        .leftJoin('match.participants', 'ps')
        .leftJoin('ps.user', 'us')
        .where({ id: req.params.id })
        .orderBy( { date: 'DESC' })
        .getOne();

      rows = this.getPage(rows, page);

      return res.send(rows);
    }

    rows = await this.repository
      .query(`
        SELECT "user".*, ROUND("user".winCount * 1.0 / "user".matchCount * 100, 2) as winPercentage
        FROM (
          SELECT u."id", u."firstName", u."lastName", u."elo", COUNT(u."id") as matchCount,
            ( SELECT COUNT(usr."id")
              FROM "user" usr
              INNER JOIN participant ON participant."userId" = usr."id"
              WHERE participant.winner = true AND usr."id" = u."id"
              GROUP BY usr."id"
            ) as winCount
          FROM "user" u
          INNER JOIN participant p ON u."id" = p."userId"
          GROUP BY u."id"
        ) "user"
        ORDER BY "user"."elo" DESC
      `);

    return res.send(rows);
  }
}
