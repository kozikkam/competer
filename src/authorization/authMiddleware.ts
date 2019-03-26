import * as jwt from 'jsonwebtoken';

interface VerifiedRoutes {
  path: RegExp;
  methods: string[];
}

export class AuthMiddleware {
  verify(verifiedRoutes: VerifiedRoutes[]) {
    return (req, res, next) => {
      if (verifiedRoutes.some(verifiedRoute => !!!(
        verifiedRoute.path.exec(req.url)
        && verifiedRoute.methods.includes(req.method)
      ))) {
        return next();
      }

      let token = req.headers['authorization'] || req.headers['x-access-token'];

      if (!token) {
        return this.failure(res);
      }

      if (token.startsWith('Bearer')) {
        token = this.getTokenFromHeader(token, res);
      }
  
      try {
        jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return this.failure(res);
      }
      
      return next();
    }
  }

  matches(requestUrl, regexp) {
    return regexp.match(requestUrl);
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
