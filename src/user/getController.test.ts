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
    const repositoryClass = class {
      createQueryBuilder() { return this; }

      select() { return this; }

      leftJoin() { return this; }

      where() { return this; }

      getOne() { return this; }

      find() { return this; }
    };
    repository = new repositoryClass();
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
    const createQueryBuilder = jest.spyOn(repository, 'createQueryBuilder');
    const select = jest.spyOn(repository, 'select');
    const leftJoin = jest.spyOn(repository, 'leftJoin');
    const where = jest.spyOn(repository, 'where');
    const getOne = jest.spyOn(repository, 'getOne').mockImplementation(() => user);
    const resSend = jest.spyOn(res, 'send');

    await getController.handle(req, res);

    expect(createQueryBuilder).toBeCalledTimes(1);
    expect(select).toBeCalledTimes(1);
    expect(leftJoin).toBeCalledTimes(4);
    expect(where).toBeCalledTimes(1);
    expect(getOne).toBeCalledTimes(1);
    expect(resSend).toBeCalledTimes(1);
    expect(resSend).toBeCalledWith(user);
  });

  it('should send all users', async () => {
    const req = { params: {} };
    jest.spyOn(repository, 'find').mockImplementation(() => [user]);
    const resSend = jest.spyOn(res, 'send');

    await getController.handle(req, res);

    expect(resSend).toBeCalledTimes(1);
    expect(resSend).toBeCalledWith([user]);
  });
});
