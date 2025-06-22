import { Request, Response, NextFunction } from 'express';
import { ApiException } from '@/utils/exceptions';

const errorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction): void => {
  // If it's one of our API exceptions
  if (error instanceof ApiException) {
    const status = error.status;
    const message = error.message;
    const errors = error.errors;
    const code = error.code || `ERROR_${status}`;

    console.error(`[${code}] ${status}: ${message}`);

    response.status(status).json({
      status,
      message,
      code,
      ...(errors && { errors }),
    });
  } else {
    // For unhandled errors, return 500
    console.error(`[UNHANDLED_ERROR] 500: ${error.message}`);
    console.error(error.stack || 'No stack trace available');

    response.status(500).json({
      status: 500,
      message: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
};

export default errorMiddleware;
