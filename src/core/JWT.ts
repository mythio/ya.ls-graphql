import { readFile } from 'fs';
import { promisify } from 'util';
import { sign, verify } from 'jsonwebtoken';
import logger from './Logger';
import { BadTokenError, TokenExpiredError, InternalError } from './ApiError';

export default class JWT {
  private static readPublicKey(): Promise<string> {
    return promisify(readFile)('keys/jwtRS256.key.pub', 'utf8');
  }

  private static readPrivateKey(): Promise<string> {
    return promisify(readFile)('keys/jwtRS256.key', 'utf8');
  }

  public static async encode(payload: JwtPayload): Promise<string> {
    const cert = await this.readPrivateKey();
    if (!cert) throw new InternalError('Token generation failed');
    // @ts-ignore
    return promisify(sign)({ ...payload }, cert, { algorithm: 'RS256' });
  }

  public static async validate(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      // @ts-ignore
      return (await promisify(verify)(token, cert)) as JwtPayload;
    } catch (err) {
      if (err && err.name === 'TokenExpiredError') throw new TokenExpiredError();
      throw new BadTokenError();
    }
  }

  public static async decode(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      // @ts-ignore
      return (await promisify(verify)(token, cert, {
        ignoreExpiration: true
      })) as JwtPayload;
    } catch (e) {
      logger.debug(e);
      throw new BadTokenError();
    }
  }
}

export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;

  constructor(issuer: string, audience: string, subject: string, param: string, validity: number) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity * 24 * 60 * 60;
    this.prm = param;
  }
}
