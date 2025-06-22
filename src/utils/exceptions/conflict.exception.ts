import HttpException from './http.exception';

/**
 * Exception for conflict errors (e.g., duplicate entries)
 */
class ConflictException extends HttpException {
  constructor(resource: string = 'Resource') {
    super(409, `${resource} already exists`, undefined, 'RESOURCE_CONFLICT');

    // Ensure the correct prototype chain for instanceof checks
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}

export default ConflictException;
