export abstract class AppError extends Error {
  abstract statusCode: number;
  details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  statusCode = 404;

  constructor(message = "Not found", cause?: unknown) {
    super(message, cause);
  }
}

export class ValidationError extends AppError {
  statusCode = 400;

  constructor(message = "Validation failed", cause?: unknown) {
    super(message, cause);
  }
}

export class UnauthorizedError extends AppError {
  statusCode = 401;

  constructor(message = "Action unauthorized", cause?: unknown) {
    super(message, cause);
  }
}

export class ConflictError extends AppError {
  statusCode = 409;

  constructor(message = "conflict error", cause?: unknown) {
    super(message, cause);
  }
}

export class ForbiddenError extends AppError {
  statusCode = 403;

  constructor(message = "Access forbidden", cause?: unknown) {
    super(message, cause);
  }
}

export class InternalServerError extends AppError {
  statusCode = 500;

  constructor(message = "Internal server error", cause?: unknown) {
    super(message, cause);
  }
}
