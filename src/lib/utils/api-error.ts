/**
 * Custom application error class for standardized API error handling.
 */
export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[] | string>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[] | string>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors?: Record<string, string[] | string>) {
    return new ApiError(400, message, errors);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message: string, errors?: Record<string, string[] | string>) {
    return new ApiError(409, message, errors);
  }

  static internal(message = 'An unexpected server error occurred') {
    return new ApiError(500, message);
  }
}

