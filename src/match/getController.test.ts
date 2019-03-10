import 'jest';

import GetController from './getController';

describe('Match Get Controller', () => {
  let controller;
  let matchRepository;
  let res;

  beforeEach(() => {
    const resClass = class {
      status() { return this; }

      send() { return this; }
    };
    res = new resClass();

    matchRepository = {
      find: () => {},
      findOne: () => {},
    };

    controller = new GetController('', matchRepository);
  });

  it('should find one if id specified', async () => {
    const req = {
      params: {
        id: 1,
      }
    };
    const resSpy = jest.spyOn(res, 'send');
    const matchRepositorySpy = jest.spyOn(matchRepository, 'findOne')
      .mockImplementation(() => 'rows');

    await controller.handle(req, res);

    expect(matchRepositorySpy).toBeCalledTimes(1);
    expect(matchRepositorySpy).nthCalledWith(1, {
      where: { id: req.params.id },
      relations: ['participants', 'participants.user'],
    });
    expect(resSpy).toBeCalledTimes(1);
    expect(resSpy).nthCalledWith(1, 'rows');
  });

  it('should find all if id not specified', async () => {
    const resSpy = jest.spyOn(res, 'send');
    const matchRepositorySpy = jest.spyOn(matchRepository, 'find')
      .mockImplementation(() => ['rows']);

    await controller.handle({ params: {} }, res);

    expect(matchRepositorySpy).toBeCalledTimes(1);
    expect(matchRepositorySpy).nthCalledWith(1, {
      relations: ['participants', 'participants.user'],
    });
    expect(resSpy).toBeCalledTimes(1);
    expect(resSpy).nthCalledWith(1, ['rows']);
  });
});
