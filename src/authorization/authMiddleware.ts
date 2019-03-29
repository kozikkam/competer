import { TokenChecker } from './tokenChecker';
import { TokenExtractor } from './tokenExtractor';

interface VerifiedRoutes {
  path: RegExp;
  methods: string[];
}

export class AuthMiddleware {
  tokenChecker: TokenChecker;
  tokenExtractor: TokenExtractor;

  constructor(tokenChecker: TokenChecker, tokenExtractor: TokenExtractor) {
    this.tokenChecker = tokenChecker;
    this.tokenExtractor = tokenExtractor
  }

  verify(verifiedRoutes: VerifiedRoutes[]) {
    return (req, res, next) => {
      if (verifiedRoutes.some(verifiedRoute => !!!(
        verifiedRoute.path.exec(req.url)
        && verifiedRoute.methods.includes(req.method)
      ))) {
        return next();
      }
      const token = this.tokenExtractor.extract(req.headers);

      try {
        this.tokenChecker.check(token);
      } catch (err) {
        return res.status(401).send('Unauthorized');
      }

      return next();
    }
  }

  matches(requestUrl, regexp) {
    return regexp.match(requestUrl);
  }
}
