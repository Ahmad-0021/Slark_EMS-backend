import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Check if authorization header is present
    if (!authHeader) {
      throw new HttpException(
        { message: 'Token not found', success: false },
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate Bearer token format
    if (!authHeader.startsWith('Bearer')) {
      throw new HttpException(
        { message: 'Invalid authorization header format', success: false },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Split to get the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException(
        { message: 'Token not found', success: false },
        HttpStatus.NOT_FOUND,
      );
    }

    // Ensure JWT_SECRET_KEY is present
    if (!process.env.JWT_SECRET_KEY) {
      throw new HttpException(
        {
          message: 'Server configuration error: Missing JWT secret key',
          success: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded,'decode')
      if (!decoded) {
        throw new HttpException(
          { message: 'Invalid token', success: false },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Attach user info to the request
      request.user = decoded;
      
      return true;
    } catch (error) {
      // Handle invalid or expired token
      throw new HttpException(
        {
          message: 'Invalid or expired token',
          success: false,
          error: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
