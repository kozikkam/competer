import 'jest';

import UserSeeder from './userSeeder';

describe('User Seeder', () => {
  let userSeeder;
  let userRepository;
  let users;

  beforeEach(() => {
    users = ['John B', 'Brock O'];
    userRepository = {
      save: async () => {},
    };

    userSeeder = new UserSeeder(userRepository);
  });

  describe('seed', () => {
    it('should seed database with given user names', async () => {
      const save = jest.spyOn(userRepository, 'save');

      await userSeeder.seed(users);

      expect(save).toBeCalledTimes(users.length);
      expect(save).nthCalledWith(1, {
        firstName: 'John',
        lastName: 'B',
      });
    });
  });
});
