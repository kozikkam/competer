import * as jwt from 'jsonwebtoken';

export default class AuthMiddleware {
  verify(loginRoute: string) {
    return (req, res, next) => {
      if (req.url === loginRoute) {
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
