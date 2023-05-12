const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(service, validator, usersService, tokenManager) {
    this._service = service;
    this._validator = validator;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
    const id = await this._usersService.verifyCredentials(request.payload);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });
    await this._service.addRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    await this._service.verifyRefreshToken(request.payload.refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(request.payload.refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return h.response({
      status: 'success',
      data: { accessToken },
    });
  }

  async deleteAuthenticationsHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);
    await this._service.verifyRefreshToken(request.payload.refreshToken);

    await this._service.deleteRefreshToken(request.payload.refreshToken);
    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
}

module.exports = AuthenticationsHandler;
