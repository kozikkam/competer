import * as crypto from 'crypto';

export class Hasher {
  hash(password: string, salt: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, buf) => {
        if (err) {
          reject(err);
        }
  
        resolve(buf.toString('hex'));
      });
    });
  }

  generateSalt(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(256, function(err, buf) {
        if (err){
          reject(err);
        }

        resolve(buf.toString('hex'));
      });
    });
  }

  async isEqual(passwd: string, passwdSalt: string, hash: string) {
    const password = await this.hash(passwd, passwdSalt);

    return password === hash;
  }
}