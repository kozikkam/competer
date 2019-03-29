import * as jwt from 'jsonwebtoken';

export class TokenChecker {
  check(token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error(err);
    }
    
    return true;
  }
}
