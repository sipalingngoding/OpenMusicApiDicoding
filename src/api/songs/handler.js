const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler(request) {
    const songs = await this._service.getSongs(request.query);
    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return h.response({
      status: 'success',
      data: { song },
    }).code(200);
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    }).code(200);
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
  }
}

module.exports = SongsHandler;
