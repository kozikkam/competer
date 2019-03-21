import { Participant } from './../participant';

export interface EloCalculatorInterface {
  calculate(participants: Array<Participant>): number;
}