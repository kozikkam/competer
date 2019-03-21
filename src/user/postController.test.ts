import 'jest';

import { UserPostController } from './';

describe('User PostController', () => {
  let postController;
  let repository;
  let res;
  let hasher;

  beforeEach(() => {
    res = {
      send: () => {},
    };
    repository = {
      create: async () => {},
      save: async () => 1,
    };
    hasher = {
      generateSalt: () => {},
      hash: () => {},
    };

    postController = new UserPostController('', repository, hasher);
  });

  it('should save request body', async () => {
    const req = {
      body: {
        id: 1,
        firstName: 'Carl',
      }
    }
    const user = { password: 'test' };
    const resSend = jest.spyOn(res, 'send');
    const save = jest.spyOn(repository, 'save').mockImplementation(async () => 'save');
    const create = jest.spyOn(repository, 'create').mockImplementation(() => user);
    const generateSalt = jest.spyOn(hasher, 'generateSalt').mockImplementation(() => 'awdaDWAI2');
    const hash = jest.spyOn(hasher, 'hash').mockImplementation(() => 'PO1PKW2MMSC');

    await postController.handle(req, res);

    const newUser = {
      password: 'PO1PKW2MMSC',
      salt: 'awdaDWAI2',
    }

    expect(create).toBeCalledTimes(1);
    expect(generateSalt).toBeCalledTimes(1);
    expect(hash).toBeCalledTimes(1);
    expect(save).toBeCalledTimes(1);
    expect(save).toBeCalledWith(newUser);
    expect(resSend).toBeCalledTimes(1);
    expect(resSend).toBeCalledWith('save');
  });
});
