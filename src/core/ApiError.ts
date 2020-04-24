enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  ACCESS_TOKEN = 'AccessTokenError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  NO_ENTRY = 'NoEntryError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError'
}

export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = 'error') {
    super(type);

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message: string = 'Invalid Credentials') {
    super(ErrorType.UNAUTHORIZED, message);

    Object.setPrototypeOf(this, AuthFailureError.prototype);
  }
}

export class InternalError extends ApiError {
  constructor(message: string = 'Internal error') {
    super(ErrorType.INTERNAL, message);

    Object.setPrototypeOf(this, InternalError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found') {
    super(ErrorType.NOT_FOUND, message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Permission denied') {
    super(ErrorType.FORBIDDEN, message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NoEntryError extends ApiError {
  constructor(message: string = "Entry don't exists") {
    super(ErrorType.NO_ENTRY, message);

    Object.setPrototypeOf(this, NoEntryError.prototype);
  }
}

export class BadTokenError extends ApiError {
  constructor(message: string = 'Token is not valid') {
    super(ErrorType.BAD_TOKEN, message);

    Object.setPrototypeOf(this, BadTokenError.prototype);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message: string = 'Token is expired') {
    super(ErrorType.TOKEN_EXPIRED, message);

    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Check the request data') {
    super(ErrorType.BAD_REQUEST, message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message: string = 'Invalid access token') {
    super(ErrorType.ACCESS_TOKEN, message);

    Object.setPrototypeOf(this, AccessTokenError.prototype);
  }
}
