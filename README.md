# Competer
Backend of Competer - an app dedicated to tracking competition between players in any domain.
Competer uses elo score to rank players.
Each match either adds or substracts from participants elo (depending on if they won or lost).

It's counterpart is [Competer Frontend](https://github.com/kozikkam/competer-frontend)

## Technology stack
- Node.js
- Typescript
- Express
- Jest
- GraphQL
- Typeorm

## Setup
This app requires a running postgresql database instance.

- copy this repository
- `npm install`
- `cp .env.example .env.dev`
- fill in environment variables
- `npm run build`
- `npm run start:dev`

## Running tests
- `npm run test`

## Authorization
This app has it's own implementation of authorization plugin. It is being activated on given endpoints like so:

```javascript
app.use(authMiddleware.verify([
  {
    path: new RegExp('^(?!\/?login).*$'), methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
]));
```

Where each object has the interface of:

```javascript
interface VerifiedRoutes {
  path: RegExp;
  methods: string[];
}
```

When user visits a URL, authorization plugin checks if it matches any of given `path` RegExps and if method used contains
in `methods` for that RegExp. If both conditions are met, the URL is protected.
If a URL is protected, it means that user has to pass his JWT token. That token is obtained through logging in.

## GraphQL
Competer features a GraphQL endpoint `/graphql`. Right now it allows for querying users only, following given schema:

```
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
```

## Entities
Right now, competer features few basic entities:

- User
- Participant
- Match

Each user can be a participant many times. Each participant can participate in only one match.
Each match can have many participants.
