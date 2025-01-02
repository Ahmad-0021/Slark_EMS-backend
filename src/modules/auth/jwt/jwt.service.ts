import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface IUser {
  username: string;
  basicPayForThisMonth: number;
  committedHoursForThisMonth: number;
  id: string;
  email: string;
  role: string;
}
@Injectable()
export class JwtService {
  private readonly secret_key = process.env.JWT_SECRET_KEY;
  private readonly expireIn = '1d';

  generateToken(payload: IUser): string {
    return jwt.sign(payload, this.secret_key, { expiresIn: this.expireIn });
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.secret_key);
    } catch (error) {
      throw new Error('invalid token');
    }
  }
}
 