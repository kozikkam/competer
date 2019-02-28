import EloCalculatorInterface from './eloCalculatorInterface';

import ParticipantEntity from './../participant/participantEntity';

export default class EloCalculator implements EloCalculatorInterface {
  K: number;

  constructor(K: number) {
    this.K = K;
  }

  calculate(participants: Array<ParticipantEntity>): number {
    const winners = this.getGroup(participants, true);
    const losers = this.getGroup(participants, false);

    const ratings = this.getTotalRatings(winners, losers);
    const transformedRatings = this.getTransformedRatings(ratings);
    const expectedScores = this.getExpectedScores(transformedRatings);
    const newRatings = this.getNewRatings(ratings, [1, 0], expectedScores);
    const eloDifferences = this.getEloDifferences(ratings, newRatings);

    return Math.round(eloDifferences[0]);
  }

  getGroup(participants: Array<ParticipantEntity>, winners: boolean): Array<ParticipantEntity> {
    return participants.filter(participant => participant.winner === winners);
  }

  getTotalRating(participants) {
    return participants.reduce((acc, participant) => acc + participant.user.elo, 0);
  }

  getTotalRatings(winners: Array<ParticipantEntity>, losers: Array<ParticipantEntity>): Array<number> {
    const winnersElo = this.getTotalRating(winners);
    const losersElo = this.getTotalRating(losers);

    return [winnersElo, losersElo];
  }

  getTransformedRatings(ratings): Array<number> {
    return ratings.map(rating => Math.pow(10, rating / 400));
  }

  getScores(group1, group2): Array<number> {
    return group1[0].winner ? [1, 0] : [0, 1];
  }

  getExpectedScores(transformedRatings): Array<number> {
    const result = [];
    const elo1 = transformedRatings[0];
    const elo2 = transformedRatings[1];

    result.push(elo1 / (elo1 + elo2));
    result.push(elo2 / (elo1 + elo2));

    return result;
  }

  getNewRatings(ratings, scores, expected): Array<number> {
    return ratings.map((rating, i) => {
      return rating + this.K * (scores[i] - expected[i]);
    })
  }

  getEloDifferences(ratings, newRatings): Array<number> {
    return ratings.map((rating, i) => {
      return newRatings[i] - rating;
    })
  }
}