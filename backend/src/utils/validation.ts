import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errors';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }


    const formattedErrors = errors.array().map((err: any) => ({
      field: err.path,
      message: err.msg,
    }));


    next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', formattedErrors));
  };
};
