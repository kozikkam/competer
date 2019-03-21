import 'jest';

import { MatchPostController } from './';

describe('Match Post Controller', () => {
  let controller;
  let matchCreator;
  let res;

  beforeEach(() => {
    matchCreator = {
      create: () => {},
    };

    const resClass = class {
      status() { return this; }

      send() { return this; }
    };
    res = new resClass();

    controller = new MatchPostController('', matchCreator);
  });

  it('should call matchCreator and send result', async () => {
    const req = {
      body: {
        userLoserIds: [1, 2],
        userWinnerIds: [3, 4],
        date: '2019-02-03',
      }
    };
    const resSpy = jest.spyOn(res, 'send');
    const matchCreatorSpy = jest.spyOn(matchCreator, 'create');

    await controller.handle(req, res);

    expect(matchCreatorSpy).toBeCalledTimes(1);
    expect(matchCreatorSpy)
      .nthCalledWith(
        1,
        req.body.userLoserIds,
        req.body.userWinnerIds,
        req.body.date
      );
    expect(resSpy).toBeCalledTimes(1);
  });
});
