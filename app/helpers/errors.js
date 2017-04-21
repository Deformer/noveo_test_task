/**
 * Created by sergey on 02.03.2017.
 */
class ParamsError extends Error {
  constructor(details) {
    super('Invalid data parameters');
    this.name = this.constructor.name;
    this.type = 'invalid_param_error';
    this.details = details.map(item => ({
      name: item.path,
      message: item.message,
      code: item.type,
    }));
    Error.captureStackTrace(this, this.constructor);
  }
}

class PageNotFoundError extends Error {
  constructor(url) {
    super(`Unable to resolve the request ${url}.`);
    this.name = this.constructor.name;
    this.type = 'invalid_request_error';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { ParamsError, PageNotFoundError };

