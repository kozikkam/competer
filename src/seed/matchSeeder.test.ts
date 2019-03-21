import 'jest';

import { MatchSeeder } from './';

describe('Match Seeder', () => {
  let matchSeeder;
  let userRepository;
  let matchCreator;
  let matches;

  beforeEach(() => {
    matches = [
      {
        "date": "2019-02-10",
        "participants": {
          "win": ["Carl C", "John B"],
          "lose": ["Ash K", "Oleg C"]
        }
      },
      {
        "date": "2019-02-13",
        "participants": {
          "win": ["Oleg C", "Carl C"],
          "lose": ["John B", "Ash K"]
        }
      },
    ];
    userRepository = {
      find: () => {},
    };
    matchCreator = {
      create: () => {},
    }

    matchSeeder = new MatchSeeder(userRepository, matchCreator);
  });

  describe('seed', () => {
    it('should create matches from argument', async () => {
      const create = jest.spyOn(matchCreator, 'create');
      jest.spyOn(matchSeeder, 'getUsers').mockImplementation(async () => [{ id: 1 }]);

      await matchSeeder.seed(matches);

      expect(create).toBeCalledTimes(2);
      expect(create).nthCalledWith(1, [1], [1], matches[0].date);
    });
  });

  describe('getUsers', () => {
    it('should get users from database by first and last name', async () => {
      const returnedUser = { id: 1, firstName: 'Name' };
      jest.spyOn(matchSeeder, 'getUser').mockImplementation(async () => returnedUser);

      const result = await matchSeeder.getUsers(['John C', 'Carl B']);

      expect(result).toEqual([returnedUser, returnedUser]);
    });
  });

  describe('getUser', async () => {
    it('should get user from database by first and last name', async () => {
      const returnedUsers = [
        { id: 1, firstName: 'Jack', lastName: 'C' },
        { id: 2, firstName: 'Jake', lastName: 'M' },
      ];
      jest.spyOn(userRepository, 'find').mockImplementation(async () => returnedUsers);

      const result = await matchSeeder.getUser('Jack C');

      expect(result).toEqual(returnedUsers[0]);
    });
  });
});
