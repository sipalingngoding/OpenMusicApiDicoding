const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validatePostUserPayload(request.payload);
    const id = await this._service.addUser(request.payload);

    return h.response({
      status: 'success',
      data: { userId: id },
    }).code(201);
  }
}

module.exports = UsersHandler;
