import HttpException from './http.exception';

/**
 * Exception for server errors
 */
class ServerException extends HttpException {
  constructor(message: string = 'Internal server error', errors?: any) {
    super(500, message, errors, 'SERVER_ERROR');

    // Ensure the correct prototype chain for instanceof checks
    Object.setPrototypeOf(this, ServerException.prototype);
  }
}

export default ServerException;
