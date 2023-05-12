const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(service, validator, playlistsService, usersService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    await this._usersService.getUserById(request.payload.userId);
    await this._playlistsService.getPlaylistById(request.payload.playlistId);
    await this._playlistsService.verifyPlaylistOwner(request.payload.playlistId, credentialId);
    const colabId = await this._service.addCollaboration(request.payload);

    return h.response({
      status: 'success',
      data: { collaborationId: colabId },
    }).code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateDeleteCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(request.payload.playlistId, credentialId);

    await this._service.deleteCollaboration(request.payload);

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus Kolaborasi',
    });
  }
}

module.exports = CollaborationsHandler;
