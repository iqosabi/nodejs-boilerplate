import HttpException from './http.exception';

/**
 * Exception for resource not found errors
 */
class NotFoundException extends HttpException {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`, undefined, 'RESOURCE_NOT_FOUND');

    // Ensure the correct prototype chain for instanceof checks
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export default NotFoundException;
