export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, 'INVALID_REQUEST', message, details);
  }

  static notFound(message = 'Route not found.'): ApiError {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static serverConfiguration(message = 'The AI service is not configured.'): ApiError {
    return new ApiError(500, 'SERVER_CONFIGURATION_ERROR', message);
  }

  static providerError(message = 'The AI provider request failed.', details?: unknown): ApiError {
    return new ApiError(502, 'AI_PROVIDER_ERROR', message, details);
  }

  static rateLimitError(message = 'AI provider rate limit exceeded. Please try again shortly.'): ApiError {
    return new ApiError(429, 'AI_RATE_LIMIT_ERROR', message);
  }

  static timeout(message = 'AI provider request timed out.'): ApiError {
    return new ApiError(504, 'AI_TIMEOUT_ERROR', message);
  }

  static internal(message = 'Internal server error.'): ApiError {
    return new ApiError(500, 'INTERNAL_SERVER_ERROR', message);
  }
}
