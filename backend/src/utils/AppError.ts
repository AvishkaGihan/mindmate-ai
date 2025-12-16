/**
 * AppError
 * * A centralized error class that extends the built-in Error.
 * * Purpose: To carry operational metadata (status code, operational flag)
 * * alongside the error message, enabling the global error handler to send
 * * consistent, clean JSON responses to the client.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Marks the error as operational (trusted) vs. programming (bug)
    // Operational errors are predictable (e.g., invalid input) and safe to send to client.
    this.isOperational = true;

    // Capture the stack trace, excluding this constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}
