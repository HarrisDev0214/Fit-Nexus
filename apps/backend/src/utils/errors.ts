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
  constructor(message = 'Bad Request') {
    super(400, 'BAD_REQUEST', message);
  }
}

export class Unauthorized401Error extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
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
export class Validation422Error extends AppError {
  constructor(message = 'Validation Error') {
    super(422, 'VALIDATION_ERROR', message);
  }
}
