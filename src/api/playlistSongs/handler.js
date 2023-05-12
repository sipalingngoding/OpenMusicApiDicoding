const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(service, validator, playlistsService, songsService, activitiesService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._activitiesService = activitiesService;
    autoBind(this);
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePostPlaylistSongsPayload(request.payload);
    await this._playlistsService.getPlaylistById(request.params.id);
    const { id: credentialId } = request.auth.credentials;
    await this._songsService.getSongById(request.payload.songId);
    await this._playlistsService.verifyPlaylistAccess(request.params.id, credentialId);

    await this._service.addPlaylistSong(request.params.id, request.payload.songId);
    await this._activitiesService.Activity(request.params.id, request.payload.songId, credentialId, 'add');

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  }

  async getPlaylistSongsHandler(request, h) {
    const playlist = await this._playlistsService.getPlaylistById(request.params.id);
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(request.params.id, credentialId);
    const songs = await this._service.getPlaylistsSongs(request.params.id);
    playlist.songs = songs;
    return h.response({
      status: 'success',
      data: { playlist },
    });
  }

  async deletePlaylistSongsHandler(request, h) {
    this._validator.validateDeletePlaylistSongsPayload(request.payload);
    await this._playlistsService.getPlaylistById(request.params.id);
    await this._songsService.getSongById(request.payload.songId);
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(request.params.id, credentialId);
    await this._service.deletePlaylistSong(request.params.id, request.payload.songId);
    await this._activitiesService.Activity(request.params.id, request.payload.songId, credentialId, 'delete');

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    });
  }

  async getPlaylistActivities(request, h) {
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.getPlaylistById(request.params.id);
    await this._playlistsService.verifyPlaylistAccess(request.params.id, credentialId);
    const activities = await this._playlistsService.playlistActivities(request.params.id);

    return h.response({
      status: 'success',
      data: {
        playlistId: request.params.id,
        activities,
      },
    });
  }
}

module.exports = PlaylistSongsHandler;
