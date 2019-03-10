import 'jest';

import GetController from './getController';
import User from './userEntity';

describe('User GetController', () => {
  let getController;
  let repository;
  let user;
  let res;

  beforeEach(() => {
    res = {
      send: () => {},
    };
    repository = {
      findOne: async () => user,
      find: async () => [user],
    };
    user = new User();
    user.firstName = 'Carl';
    user.lastName = 'Carlos';
    user.elo = 1000;

    getController = new GetController('', repository);
  });

  it('should send one user', async () => {
    const req = {
      params: { id: 1 },
    };
    jest.spyOn(repository, 'findOne').mockImplementation(() => user);
    const resSend = jest.spyOn(res, 'send');

    await getController.handle(req, res);

    expect(resSend).toBeCalledTimes(1);
    expect(resSend).toBeCalledWith(user);
  });

  it('should send all users', async () => {
    const req = { params: {} };
    jest.spyOn(repository, 'findOne').mockImplementation(() => user);
    const resSend = jest.spyOn(res, 'send');

    await getController.handle(req, res);

    expect(resSend).toBeCalledTimes(1);
    expect(resSend).toBeCalledWith([user]);
  });
});
