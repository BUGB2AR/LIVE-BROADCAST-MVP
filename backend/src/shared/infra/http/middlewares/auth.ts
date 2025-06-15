import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../../../../shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  role: string; 
}

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);
    const { sub, role } = decoded as TokenPayload;

    request.user = {
      id: sub,
      role: role as 'streamer' | 'viewer',
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};