const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const idPlaylist = await this._service.addPlaylist({ name, owner: credentialId });
    return h.response({
      status: 'success',
      data: { playlistId: idPlaylist },
    }).code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return h.response({
      status: 'success',
      data: { playlists },
    });
  }

  async deletePlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(request.params.id, credentialId);
    await this._service.deletePlaylistById(request.params.id);

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist',
    });
  }
}

module.exports = PlaylistsHandler;
