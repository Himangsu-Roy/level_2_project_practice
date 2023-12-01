class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number, stuck = '') {
    super(message);
    this.statusCode = statusCode;

    if (stuck) {
      this.stack = stuck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;