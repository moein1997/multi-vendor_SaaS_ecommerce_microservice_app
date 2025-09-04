export class AppError extends Error {
    public readonly statusCode : number;
    public readonly isOperational : boolean;
    public readonly details?: any;

    constructor(message : string, statusCode = 500, isOperational = true, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }

} 

//Not found error
export class NotFoundError extends AppError {
    constructor(message = 'Resourses Not Found', details?: any) {
        super(message, 404, true, details);
    }
}

//validation error
export class ValidationError extends AppError {
    constructor(message = 'Invalid request data', details?: any) {
        super(message, 422, true, details);
    }
}

//Authentication error
export class AuthError extends AppError {
    constructor(message = 'Unauthorizes', details?: any) {
        super(message, 401, true, details);
    }
}

// Forbidden error
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access', details?: any) {
        super(message, 403, true, details);
    }
}

// Database error
export class DatabaseError extends AppError {
    constructor(message = 'Database Error', details?: any) {
        super(message, 500, true, details);
    }
}

// Rate limit error
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests, please try again later.', details?: any) {
        super(message, 429, true, details);
    }
}

// Bad request error
export class BadRequestError extends AppError {
    constructor(message = 'Bad Request', details?: any) {
        super(message, 400, true, details);
    }
} 