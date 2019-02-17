import * as dotenv from 'dotenv';
dotenv.config(`.env.${process.env.NODE_ENV}`);

export default class EnvValidator {
  requiredEnvs: Array<string>;

  constructor(requiredEnvs) {
    this.requiredEnvs = requiredEnvs;
  }

  validateEnv(): void {
    this.requiredEnvs.forEach((key: string) => {
      if (!(key in process.env)) {
        throw `${key} is required, and is not specified in environment variables`;
      }
    });
  }
}