import HttpException from './http.exception';

/**
 * Exception for validation errors
 */
class ValidationException extends HttpException {
  constructor(errors: any) {
    super(400, 'Validation error', errors, 'VALIDATION_ERROR');

    // Ensure the correct prototype chain for instanceof checks
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export default ValidationException;
