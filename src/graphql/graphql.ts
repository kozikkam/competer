import * as graphql from 'graphql';
import * as expressGraphql from 'express-graphql';

const { buildSchema } = graphql;

export default class Graphql {
  app: any;

  constructor(app) {
    this.app = app;
  }

  init(userGetController) {
    this.app.use('/graphql', expressGraphql({
      schema: this.getSchema(),
      rootValue: {
        user: this.getResolver(userGetController),
        users: this.getResolver(userGetController),
      },
      graphiql: true
    }));
  }

  test(res) {
    res.cookie('foo2', 'bar2', {
      expires: new Date(Date.now() + 900000),
      httpOnly: true
    })
  }

  getSchema() {
    return buildSchema(`
      type Query {
        user(id: Int!): User
        users: [User]
      },
      type User {
        firstName: String!
        lastName: String!
        elo: Int!
        participants: [Participant]
      }
      type Participant {
        previousElo: Int!
        newElo: Int!
        eloChange: Int!
        match: Match!
        user: User!
      }
      type Match {
        date: String!
        participants: [Participant]
      }
    `);
  }

  getResolver(controller) {
    const res = {
      send: arg => arg,
    };

    return (arg) => {
      const req = {
        params: arg,
      };

      return controller.handle(req, res);
    }
  }
}