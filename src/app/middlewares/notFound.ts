/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';


// Not found middleware
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    error: {
      code: 404,
      message: 'The requested resource was not found on this server.',
    },
  });
};

export default notFound;
