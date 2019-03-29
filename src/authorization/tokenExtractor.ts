export class TokenExtractor {
  extract(headers) {
    let token = headers['authorization'] || headers['x-access-token'];

    if (!token) {
      return null;
    }

    if (token.startsWith('Bearer')) {
      token = this.getTokenFromHeader(token);
    }

    return token;
  }

  getTokenFromHeader(header) {
    let token = header.match(/\S+\s+(\S+)/);

    if (!token) {
      return null;
    }

    [token] = token.slice(-1);

    return token;
  }
}
