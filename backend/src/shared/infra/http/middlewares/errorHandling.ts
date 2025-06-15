import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../errors/AppError';
import { ZodError } from 'zod';

export const errorHandlingMiddleware = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};