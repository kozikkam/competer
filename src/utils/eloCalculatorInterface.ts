import ParticipantEntity from './../participant/participantEntity';

export default interface EloCalculatorInterface {
  calculate(participants: Array<ParticipantEntity>): number;
}