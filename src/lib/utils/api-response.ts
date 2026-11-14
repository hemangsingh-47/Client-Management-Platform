import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './api-error';

export interface ApiResponseSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiResponseError {
  success: false;
  message: string;
  errors?: Record<string, string[] | string>;
}

/**
 * Creates a standardized JSON success response.
 */
export function successResponse<T>(
  data: T,
  message = 'Operation completed successfully',
  statusCode = 200
): NextResponse<ApiResponseSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Centralized error handler that formats any error into the standard API format.
 * Prevents internal DB/SQL leakage in production.
 */
export function errorResponse(error: unknown): NextResponse<ApiResponseError> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join('.') || 'body';
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed. Please verify the submitted fields.',
        errors: fieldErrors,
      },
      { status: 400 }
    );
  }

  // Generic or unexpected internal errors (safe shielding)
  console.error('Unhandled Server Error:', error);
  return NextResponse.json(
    {
      success: false,
      message: 'An unexpected internal error occurred on the server.',
    },
    { status: 500 }
  );
}

