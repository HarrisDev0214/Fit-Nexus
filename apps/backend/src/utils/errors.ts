export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequest400Error extends AppError {
  constructor(message = 'Bad Request', code = 'BAD_REQUEST') {
    super(400, code, message);
  }
}

export class Unauthorized401Error extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class Forbidden403Error extends AppError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
  }
}

export class NotFound404Error extends AppError {
  constructor(message = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
  }
}

export class Conflict409Error extends AppError {
  constructor(message = 'Conflict') {
    super(409, 'CONFLICT', message);
  }
}

type ValidationErrorDetail = {
  field: PropertyKey | undefined;
  code: string;
  message: string;
};
export class Validation422Error extends AppError {
  errors?: ValidationErrorDetail[];

  constructor(
    message = 'Validation Error',
    errors?: ValidationErrorDetail[]
  ) {
    super(422, 'VALIDATION_ERROR', message);
    this.errors = errors;
  }
}
