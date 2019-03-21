import 'jest';

import { EloCalculator } from './';
import { Participant } from './../participant';
import { User } from './../user';

describe('EloCalculator', () => {
  let eloCalculator;
  let K;
  let participant1;
  let participant2;
  let participant3;
  let participants;

  beforeEach(() => {
    K = 10;
    eloCalculator = new EloCalculator(K);

    participants = [1, 2, 3].map(() => {
      const p = new Participant();
      p.winner = true;
      p.user = new User();
      p.user.elo = 1000;

      return p;
    });
    [participant1, participant2, participant3] = participants;
  });

  describe('calculate', () => {
    it('should call all internal functions, and return rounded number', () => {
      const getGroup = jest.spyOn(eloCalculator, 'getGroup').mockImplementation(arg => arg);
      const getTotalRatings = jest.spyOn(eloCalculator, 'getTotalRatings').mockImplementation(arg => arg);
      const getTransformedRatings = jest.spyOn(eloCalculator, 'getTransformedRatings').mockImplementation(arg => arg);
      const getExpectedScores = jest.spyOn(eloCalculator, 'getExpectedScores').mockImplementation(arg => arg);
      const getNewRatings = jest.spyOn(eloCalculator, 'getNewRatings').mockImplementation(arg => arg);
      const getEloDifferences = jest.spyOn(eloCalculator, 'getEloDifferences').mockImplementation(arg => [10.4]);

      const result = eloCalculator.calculate();

      expect(getGroup).toBeCalledTimes(2);
      expect(getTotalRatings).toBeCalledTimes(1);
      expect(getTransformedRatings).toBeCalledTimes(1);
      expect(getExpectedScores).toBeCalledTimes(1);
      expect(getNewRatings).toBeCalledTimes(1);
      expect(getExpectedScores).toBeCalledTimes(1);
      expect(getEloDifferences).toBeCalledTimes(1);
      expect(result).toEqual(10);
    });
  });

  describe('getGroup', () => {
    it('should get losers or winners from participants', () => {
      participant2.winner = false;

      const result = eloCalculator.getGroup(participants, true);

      expect(result).toEqual([participant1, participant3]);
    });
  });

  describe('getTotalRating', () => {
    it('should sum all ratings from team', () => {
      const result = eloCalculator.getTotalRating([participant1, participant2]);

      expect(result).toEqual(2000);
    });
  });

  describe('getTotalRatings', () => {
    it('should get ratings for two teams', () => {
      jest.spyOn(eloCalculator, 'getTotalRating').mockImplementation(arg => 1000);

      const result = eloCalculator.getTotalRatings(participants, participants);

      expect(result).toEqual([1000, 1000]);
    });
  });

  describe('getTransformedRatings', () => {
    it('should get transformed total ratings', () => {
      const rating = 1000;
      const expectedSingle = Math.pow(10, rating / 400);
      const expected = [expectedSingle, expectedSingle];

      const result = eloCalculator.getTransformedRatings([rating, rating]);

      expect(result).toEqual(expected);
    });
  });

  describe('getExpectedScores', () => {
    it('should get expected scores from transformed ratings', () => {
      const transformedRatings = [100, 100];
      const expected = [0.5, 0.5];

      const result = eloCalculator.getExpectedScores(transformedRatings);

      expect(result).toEqual(expected);
    });
  });

  describe('getNewRatings', () => {
    it('should get new ratings for participants', () => {
      const ratings = [1000, 1000];
      const scores = [1, 0];
      const expectedScores = [0.5, 0.5];
      const expectedFirst = ratings[0] + K * (scores[0] - expectedScores[0]);
      const expectedSecond = ratings[1] + K * (scores[1] - expectedScores[1]);
      const expected = [expectedFirst, expectedSecond];

      const result = eloCalculator.getNewRatings(ratings, scores, expectedScores);

      expect(result).toEqual(expected);
    });
  });

  describe('getEloDifferences', () => {
    it('should get elo differences', () => {
      const ratings = [1000, 1000];
      const newRatings = [1020, 980];
      const expected = [20, -20];

      const result = eloCalculator.getEloDifferences(ratings, newRatings);

      expect(result).toEqual(expected);
    })
  });
});
