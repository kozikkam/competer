import 'jest';

import PostController from './postController';

describe('User PostController', () => {
  let postController;
  let repository;
  let res;

  beforeEach(() => {
    res = {
      send: () => {},
    };
    repository = {
      save: async () => 1,
    };

    postController = new PostController('', repository);
  });

  it('should save request body', async () => {
    const req = {
      body: {
        id: 1,
        firstName: 'Carl',
      }
    }
    const resSend = jest.spyOn(res, 'send');
    const repositorySave = jest.spyOn(repository, 'save')
      .mockImplementation(async () => 'save');

    await postController.handle(req, res);

    expect(resSend).toBeCalledTimes(1);
    expect(resSend).toBeCalledWith('save');
    expect(repositorySave).toBeCalledTimes(1);
    expect(repositorySave).toBeCalledWith(req.body);
  });
});
