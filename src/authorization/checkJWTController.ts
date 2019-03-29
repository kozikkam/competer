import { BasicController } from '../api';
import { TokenChecker } from './tokenChecker';
import { TokenExtractor } from './tokenExtractor';

export class CheckJWTController extends BasicController {
  path: string;
  tokenChecker: TokenChecker;
  tokenExtractor: TokenExtractor;

  constructor(path: string, tokenChecker, tokenExtractor) {
    super('POST', path);

    this.tokenChecker = tokenChecker;
    this.tokenExtractor = tokenExtractor;
  }

  handle(req, res, next) {
    const token = this.tokenExtractor.extract(req.headers);

    try {
      this.tokenChecker.check(token);
    } catch (err) {
      return this.failure(res);
    }
    
    return res.status(200).send('ok');
  }

  failure(res) {
    return res.status(401).send('Authorization failed');
  }

  getTokenFromHeader(header, res) {
    let token = header.match(/\S+\s+(\S+)/);

    if (!token) {
      return this.failure(res);  
    }

    [token] = token.slice(-1);

    return token;
  }
}
