import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    // Replace req.body with validated data
    req.body = result.data;
    next();
  };
};
