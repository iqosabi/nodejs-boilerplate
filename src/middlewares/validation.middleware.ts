import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationException } from '@/utils/exceptions';

/**
 * Middleware that validates request data against a Zod schema
 */
const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // If validation passes, move to the next middleware
      next();
    } catch (error) {
      // If validation fails, format the error messages
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        next(new ValidationException(errors));
      } else {
        next(error);
      }
    }
  };

export default validate;
