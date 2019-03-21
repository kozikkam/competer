import 'jest';

import { MatchGetController } from './';

describe('Match Get Controller', () => {
  let controller;
  let res;
  let repository;

  beforeEach(() => {
    const resClass = class {
      status() { return this; }

      send() { return this; }
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
    res = new resClass();

    controller = new MatchGetController('', repository);
  });

  it('should find one if id specified', async () => {
    const req = {
      params: {
        id: 1,
      }
    };
    const resSpy = jest.spyOn(res, 'send');
    const createQueryBuilder = jest.spyOn(repository, 'createQueryBuilder');
    const select = jest.spyOn(repository, 'select');
    const leftJoin = jest.spyOn(repository, 'leftJoin');
    const where = jest.spyOn(repository, 'where');
    const getOne = jest.spyOn(repository, 'getOne')
      .mockImplementation(() => 'rows');

    await controller.handle(req, res);

    expect(createQueryBuilder).toBeCalledTimes(1);
    expect(select).toBeCalledTimes(1);
    expect(leftJoin).toBeCalledTimes(2);
    expect(where).toBeCalledTimes(1);
    expect(getOne).toBeCalledTimes(1);
    expect(resSpy).toBeCalledTimes(1);
    expect(resSpy).nthCalledWith(1, 'rows');
  });

  it('should find all if id not specified', async () => {
    const resSpy = jest.spyOn(res, 'send');
    const repositorySpy = jest.spyOn(repository, 'find')
      .mockImplementation(() => ['rows']);

    await controller.handle({ params: {} }, res);

    expect(repositorySpy).toBeCalledTimes(1);
    expect(repositorySpy).nthCalledWith(1, {
      relations: ['participants', 'participants.user'],
    });
    expect(resSpy).toBeCalledTimes(1);
    expect(resSpy).nthCalledWith(1, ['rows']);
  });
});
