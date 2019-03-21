import 'jest';

import { EloUpdater } from './';
import { Participant } from './../participant';
import { User } from './../user/userEntity';

describe('Unit tests - EloCalculator', () => {
  let eloUpdater;
  let userRepository;
  let participants;
  let participant1;

  beforeEach(() => {
    userRepository = {
      save: () => Promise.resolve(),
    };

    eloUpdater = new EloUpdater(userRepository);

    participants = [1, 2, 3].map(() => {
      const p = new Participant();
      p.winner = true;
      p.user = new User();
      p.user.elo = 1000;

      return p;
    });
    [participant1] = participants;
  });

  describe('updateAll', () => {
    it('should call updateSingle for all participants', async () => {
      const updateSingle = jest.spyOn(eloUpdater, 'updateSingle').mockImplementation();

      await eloUpdater.updateAll(participants);
      
      expect(updateSingle).toBeCalledTimes(participants.length);
    });
  });

  describe('updateSingle', () => {
    it('should update single participants elo by given value', () => {
      const repositorySave = jest.spyOn(userRepository, 'save');

      eloUpdater.updateSingle(participant1, 10);

      expect(repositorySave).toBeCalledTimes(1);
      expect(participant1.eloChange).toEqual(10);
      expect(participant1.user.elo).toEqual(1010);
    });
  });
});
