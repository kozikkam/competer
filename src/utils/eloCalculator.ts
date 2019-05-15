import { EloCalculatorInterface } from './';

import { Participant } from './../participant';

export class EloCalculator implements EloCalculatorInterface {
  K: number;
  capMin: number;

  constructor(K: number) {
    this.K = K;
    this.capMin = K / 5;
  }

  calculate(participants: Array<Participant>): number {
    const winners = this.getGroup(participants, true);
    const losers = this.getGroup(participants, false);

    const ratings = this.getTotalRatings(winners, losers);
    const transformedRatings = this.getTransformedRatings(ratings);
    const expectedScores = this.getExpectedScores(transformedRatings);
    const eloDifference = this.getEloDifferences(expectedScores[0]);

    return Math.round(eloDifference);
  }

  getGroup(participants: Array<Participant>, winners: boolean): Array<Participant> {
    return participants.filter(participant => participant.winner === winners);
  }

  getTotalRating(participants) {
    return participants.reduce((acc, participant) => acc + participant.user.elo, 0);
  }

  getTotalRatings(winners: Array<Participant>, losers: Array<Participant>): Array<number> {
    const winnersElo = this.getTotalRating(winners);
    const losersElo = this.getTotalRating(losers);

    return [winnersElo, losersElo];
  }

  getTransformedRatings(ratings): Array<number> {
    return ratings.map(rating => Math.pow(10, rating / 400));
  }

  getExpectedScores(transformedRatings): Array<number> {
    const result = [];
    const elo1 = transformedRatings[0];
    const elo2 = transformedRatings[1];

    result.push(elo1 / (elo1 + elo2));
    result.push(elo2 / (elo1 + elo2));

    return result;
  }

  getEloDifferences(expected): number {    
    const eloDifference = Math.abs(this.K * (1 - expected));

    if (eloDifference > this.K) {
      return this.K;
    }

    if (eloDifference <= this.capMin && eloDifference >= 0) {
      return this.capMin;
    }

    return eloDifference;
  }
}
