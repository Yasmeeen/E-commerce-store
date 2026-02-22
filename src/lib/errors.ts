export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export function handleApiError(error: unknown): { status: number; body: { message: string; code?: string; details?: unknown } } {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        message: error.message,
        code: error.code,
        ...(error instanceof ValidationError && error.details ? { details: error.details } : {}),
      },
    };
  }
  console.error(error);
  return {
    status: 500,
    body: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
  };
}
