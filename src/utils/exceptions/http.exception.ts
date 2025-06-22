import ApiException from './api.exception';

/**
 * General HTTP exception
 */
class HttpException extends ApiException {
  constructor(status: number, message: string, errors?: any, code?: string) {
    super(status, message, errors, code);

    // Ensure the correct prototype chain for instanceof checks
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export default HttpException;
